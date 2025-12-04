import { Injectable } from '@nestjs/common';
import { CreatePaymentRequestDto } from './dto/createPaymentRequest.dto';
import { ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly youKassa: YooCheckout;

  constructor() {
    this.youKassa = new YooCheckout({
      shopId: process.env.YOOKASSA_SHOP_ID as string,
      secretKey: process.env.YOOKASSA_SECRET_KEY as string,
    });
  }
  async createPayment(dto: CreatePaymentRequestDto) {
    const createPayload: ICreatePayment = {
      amount: {
        value: dto.value.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: process.env.YOOKASSA_RETURN_URL,
      },
      metadata: {
        orderId: dto.orderId,
        userId: dto.userId,
      },
    };

    return await this.youKassa.createPayment(createPayload, uuidv4());
  }
}
