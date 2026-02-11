import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentRequestDto } from './dto/createPaymentRequest.dto';
import { ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import Order, { OrderStatus, PaymentStatus } from '../model/order.entity';
import { Equal, Repository } from 'typeorm';
import {
  YooKassaWebhookDto,
  YooKassaWebhookPaymentObjectDto,
} from './dto/yookassa-webhook.dto';

@Injectable()
export class PaymentsService {
  private readonly youKassa: YooCheckout;

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {
    this.youKassa = new YooCheckout({
      shopId: process.env.YOOKASSA_SHOP_ID as string,
      secretKey: process.env.YOOKASSA_SECRET_KEY as string,
    });
  }

  async createPayment(user: any, dto: CreatePaymentRequestDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: Equal(dto.orderId) },
      relations: ['user'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.user?.id !== user.id) {
      throw new NotFoundException('Order not found');
    }
    if (!order.totalPrice || order.totalPrice <= 0) {
      throw new BadRequestException('Order total is invalid');
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    const createPayload: ICreatePayment = {
      amount: {
        value: order.totalPrice.toFixed(2),
        currency: order.currency ?? 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: dto.returnUrl ?? process.env.YOOKASSA_RETURN_URL,
      },
      metadata: {
        orderId: String(order.id),
        userId: String(user.id),
      },
      description: `Order #${order.id}`,
    };

    order.paymentStatus = PaymentStatus.PENDING;
    await this.ordersRepository.save(order);

    return this.youKassa.createPayment(createPayload, uuidv4());
  }

  async handleYooKassaWebhook(payload: YooKassaWebhookDto) {
    const incomingPayment = payload?.object;
    const paymentId = incomingPayment?.id;
    if (!paymentId) {
      return { ok: true, ignored: true, reason: 'missing_payment_id' };
    }

    const trustedPayment = await this.getTrustedPayment(paymentId, incomingPayment);
    const orderId = Number(trustedPayment.metadata?.orderId);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return { ok: true, ignored: true, reason: 'missing_order_id' };
    }

    const order = await this.ordersRepository.findOneBy({ id: Equal(orderId) });
    if (!order) {
      return { ok: true, ignored: true, reason: 'order_not_found' };
    }

    if (this.isAmountMismatch(order.totalPrice, trustedPayment.amount?.value)) {
      return { ok: true, ignored: true, reason: 'amount_mismatch' };
    }

    const nextPaymentStatus = this.mapPaymentStatus(trustedPayment.status);
    if (!nextPaymentStatus) {
      return { ok: true, ignored: true, reason: 'unsupported_payment_status' };
    }

    const now = new Date();
    order.paymentStatus = nextPaymentStatus;
    if (nextPaymentStatus === PaymentStatus.PAID) {
      if (order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.PAID;
      }
      if (!order.paidAt) {
        order.paidAt = now;
      }
    }

    await this.ordersRepository.save(order);
    return {
      ok: true,
      orderId: order.id,
      paymentId,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    };
  }

  private async getTrustedPayment(
    paymentId: string,
    fallbackPayment: YooKassaWebhookPaymentObjectDto,
  ): Promise<YooKassaWebhookPaymentObjectDto> {
    try {
      const payment = await this.youKassa.getPayment(paymentId);
      return {
        id: payment.id,
        status: payment.status as YooKassaWebhookPaymentObjectDto['status'],
        metadata: payment.metadata,
        amount: payment.amount,
      };
    } catch {
      return fallbackPayment;
    }
  }

  private mapPaymentStatus(
    status: YooKassaWebhookPaymentObjectDto['status'],
  ): PaymentStatus | null {
    if (status === 'succeeded') return PaymentStatus.PAID;
    if (status === 'canceled') return PaymentStatus.FAILED;
    if (status === 'pending' || status === 'waiting_for_capture') {
      return PaymentStatus.PENDING;
    }
    return null;
  }

  private isAmountMismatch(orderTotal?: number, paymentValue?: string) {
    if (!orderTotal || !paymentValue) return false;
    const paymentAmount = Number(paymentValue);
    if (!Number.isFinite(paymentAmount)) return false;

    return Math.abs(orderTotal - paymentAmount) > 0.01;
  }
}
