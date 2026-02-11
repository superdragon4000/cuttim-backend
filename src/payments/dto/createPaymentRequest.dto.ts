import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsInt()
  orderId: number;

  @IsOptional()
  @IsString()
  returnUrl?: string;
}
