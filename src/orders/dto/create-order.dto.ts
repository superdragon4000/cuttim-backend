import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderType } from '../../model/order.entity';
import { PreviewOrderDto } from './preview-order.dto';

export class CreateOrderDto extends PreviewOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @IsEnum(OrderType)
  @IsOptional()
  type: OrderType = OrderType.LASER;
}
