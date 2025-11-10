import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Order from '../model/order.entity';
import { Between, Equal, FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersQueryDto } from './dto/find-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private usersService: UsersService,
  ) {}

  async createOrder(user: any, createOrderDto: CreateOrderDto): Promise<Order> {
    const userDb = await this.usersService.findUserById(user.id);
    if (!userDb) {
      throw new NotFoundException('User not found');
    }
    const order = await this.ordersRepository.save({
      ...createOrderDto,
      user: userDb,
    });
    return order;
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({
      id: Equal(id),
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOrders(
    user: any,
    query: FindOrdersQueryDto,
  ): Promise<Order[]> {
    const where: FindOptionsWhere<Order> = {
      user: { id: user.id },
      ...(query.status && { status: query.status }),
      ...(query.fromDate &&
        query.toDate && {
          createdAt: Between(new Date(query.fromDate), new Date(query.toDate)),
        }),
    };

    const orderField = query.orderBy ?? 'created_at';
    const direction = query.orderDirection ?? 'DESC';

    return this.ordersRepository.find({
      where,
      take: query.limit ?? 20,
      skip: query.offset ?? 0,
      order: { [orderField]: direction },
    });
  }

  async findOrderFile(orderId: number, fileId: number) {
    const order = await this.ordersRepository.findOne({
      where: { id: Equal(orderId) },
      relations: ['files'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const orderFile = order.files.find(file => file.id === fileId);
    if (!orderFile) {
      throw new NotFoundException('File not found');
    }
    return orderFile;
  }
}