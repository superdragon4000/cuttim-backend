import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersQueryDto } from './dto/find-orders.dto';
import { PricingService } from '../pricing/pricing.service';
import { FilesService } from '../files/files.service';
import { MaterialsService } from '../materials/materials.service';
import Order, {
  OrderStatus,
  PaymentStatus,
  ShippingMethod,
} from '../model/order.entity';
import OrderFile from '../model/orderFile.entity';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { ShippingAddressDto } from './dto/shipping-address.dto';

type QuoteLineItem = {
  fileId: number;
  fileName: string;
  materialId: number;
  materialName: string;
  materialType: string;
  quantity: number;
  width: number;
  height: number;
  areaMm2: number;
  unitPrice: number;
  lineTotal: number;
};

type QuotePreview = {
  currency: string;
  items: QuoteLineItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shipping: {
    method: ShippingMethod;
    estimatedDays: number;
  };
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderFile)
    private orderFilesRepository: Repository<OrderFile>,
    private usersService: UsersService,
    private pricingService: PricingService,
    private filesService: FilesService,
    private materialsService: MaterialsService,
  ) {}

  async previewOrder(dto: PreviewOrderDto): Promise<QuotePreview> {
    return this.buildQuote(dto);
  }

  async createOrder(user: any, createOrderDto: CreateOrderDto): Promise<Order> {
    const userDb = await this.usersService.findUserById(user.id);
    if (!userDb) {
      throw new NotFoundException('User not found');
    }

    const quote = await this.buildQuote(createOrderDto);
    const { shipping } = createOrderDto;

    const order = await this.ordersRepository.save({
      user: userDb,
      type: createOrderDto.type,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      comment: createOrderDto.comment,
      recipientName: shipping.recipientName,
      recipientPhone: shipping.recipientPhone,
      shippingCountry: shipping.country,
      shippingCity: shipping.city,
      shippingAddressLine1: shipping.addressLine1,
      shippingAddressLine2: shipping.addressLine2,
      shippingPostalCode: shipping.postalCode,
      shippingMethod: shipping.method,
      shippingCost: quote.shippingCost,
      totalPrice: quote.total,
      currency: quote.currency,
    });

    for (const item of quote.items) {
      const file = await this.filesService.findFileById(item.fileId);
      const material = await this.materialsService.getMaterialById(
        item.materialId,
      );

      const orderFile = this.orderFilesRepository.create({
        file,
        material,
        quantity: item.quantity,
        calculatedPrice: item.lineTotal,
        order,
      });

      await this.orderFilesRepository.save(orderFile);
    }

    return this.findOrderById(order.id, user);
  }

  async findOrderById(id: number, user: any): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: Equal(id) },
      relations: ['files', 'files.file', 'files.material', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'client' && order.user?.id !== user.id) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOrders(user: any, query: FindOrdersQueryDto): Promise<Order[]> {
    const where: FindOptionsWhere<Order> = {
      ...(query.status && { status: query.status }),
      ...(query.paymentStatus && { paymentStatus: query.paymentStatus }),
      ...(query.fromDate &&
        query.toDate && {
          created_at: Between(new Date(query.fromDate), new Date(query.toDate)),
        }),
    };

    if (user.role === 'client') {
      where.user = { id: user.id };
    } else if (query.userId) {
      where.user = { id: query.userId };
    }

    const orderField = query.orderBy ?? 'created_at';
    const direction = query.orderDirection ?? 'DESC';

    return this.ordersRepository.find({
      where,
      take: query.limit ?? 20,
      skip: query.offset ?? 0,
      relations: ['files', 'files.file', 'files.material', 'user'],
      order: { [orderField]: direction },
    });
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    managerComment?: string,
  ): Promise<Order> {
    const order = await this.findOrderByIdForManager(orderId);
    order.status = status;

    if (managerComment !== undefined) {
      order.managerComment = managerComment;
    }

    const now = new Date();
    if (status === OrderStatus.PAID) order.paidAt = now;
    if (status === OrderStatus.FABRICATED) order.fabricatedAt = now;
    if (status === OrderStatus.SHIPPED) order.shippedAt = now;
    if (status === OrderStatus.COMPLETED) order.completedAt = now;

    return this.ordersRepository.save(order);
  }

  async updateTracking(orderId: number, trackingNumber: string): Promise<Order> {
    const order = await this.findOrderByIdForManager(orderId);
    order.trackingNumber = trackingNumber;
    order.trackingAssignedAt = new Date();

    if (order.status !== OrderStatus.SHIPPED) {
      order.status = OrderStatus.SHIPPED;
      order.shippedAt = new Date();
    }

    return this.ordersRepository.save(order);
  }

  async updatePaymentStatus(
    orderId: number,
    paymentStatus: PaymentStatus,
  ): Promise<Order> {
    const order = await this.findOrderByIdForManager(orderId);
    order.paymentStatus = paymentStatus;

    if (paymentStatus === PaymentStatus.PAID) {
      order.paidAt = new Date();
      if (order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.PAID;
      }
    }

    return this.ordersRepository.save(order);
  }

  async markOrderPaid(orderId: number): Promise<Order> {
    return this.updatePaymentStatus(orderId, PaymentStatus.PAID);
  }

  private async findOrderByIdForManager(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: Equal(orderId) },
      relations: ['files', 'files.file', 'files.material', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private async buildQuote(dto: PreviewOrderDto): Promise<QuotePreview> {
    if (!dto.files?.length) {
      throw new BadRequestException('At least one file is required');
    }

    const items: QuoteLineItem[] = [];
    let subtotal = 0;

    for (const f of dto.files) {
      const file = await this.filesService.findFileById(f.fileId);
      const material = await this.materialsService.getMaterialById(f.materialId);

      const lineTotal = this.pricingService.calculate(file, material, f.quantity);
      const unitPrice = lineTotal / f.quantity;
      subtotal += lineTotal;

      items.push({
        fileId: file.id,
        fileName: file.originalName,
        materialId: material.id,
        materialName: material.name,
        materialType: material.type,
        quantity: f.quantity,
        width: file.width ?? 0,
        height: file.height ?? 0,
        areaMm2: file.areaMm2 ?? 0,
        unitPrice,
        lineTotal,
      });
    }

    const shippingCalculation = this.calculateShipping(dto.shipping, subtotal);
    return {
      currency: 'RUB',
      items,
      subtotal,
      shippingCost: shippingCalculation.cost,
      total: subtotal + shippingCalculation.cost,
      shipping: {
        method: dto.shipping.method,
        estimatedDays: shippingCalculation.estimatedDays,
      },
    };
  }

  private calculateShipping(shipping: ShippingAddressDto, subtotal: number) {
    if (shipping.method === ShippingMethod.PICKUP) {
      return { cost: 0, estimatedDays: 0 };
    }

    const city = shipping.city.trim().toLowerCase();
    const isBigCity = ['moscow', 'saint petersburg', 'санкт-петербург', 'москва'].includes(city);

    const baseCostByMethod: Record<ShippingMethod, number> = {
      [ShippingMethod.PICKUP]: 0,
      [ShippingMethod.COURIER]: isBigCity ? 490 : 690,
      [ShippingMethod.EXPRESS]: isBigCity ? 990 : 1290,
    };

    const estimatedDaysByMethod: Record<ShippingMethod, number> = {
      [ShippingMethod.PICKUP]: 0,
      [ShippingMethod.COURIER]: isBigCity ? 2 : 4,
      [ShippingMethod.EXPRESS]: 1,
    };

    const freeShippingThreshold = 25000;
    const baseCost = baseCostByMethod[shipping.method];
    const discountedCost =
      shipping.method !== ShippingMethod.EXPRESS && subtotal >= freeShippingThreshold
        ? 0
        : baseCost;

    return {
      cost: discountedCost,
      estimatedDays: estimatedDaysByMethod[shipping.method],
    };
  }
}
