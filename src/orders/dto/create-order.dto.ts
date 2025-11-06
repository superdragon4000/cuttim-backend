import { IsEnum, IsOptional } from 'class-validator';
import { OrderType } from '../../model/order.entity';

export class CreateOrderDto {
  // Define properties needed to create an order
  @IsOptional()
  comment?: string;

  @IsEnum(OrderType)
  @IsOptional()
  type: OrderType = OrderType.LASER;
}
