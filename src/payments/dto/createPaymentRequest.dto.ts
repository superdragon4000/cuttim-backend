import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsNumber()
  value: number;

  @IsString()
  orderId: string;

  @IsString()
  userId: string;
}
