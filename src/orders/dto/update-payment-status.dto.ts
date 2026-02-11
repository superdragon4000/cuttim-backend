import { IsEnum } from 'class-validator';
import { PaymentStatus } from '../../model/order.entity';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}
