import {
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '../../model/order.entity';
import { Type } from 'class-transformer';

export class CreateOrderFilesDto {
  @IsInt()
  fileId: number;

  @IsInt()
  materialId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => CreateOrderFilesDto)
  files: CreateOrderFilesDto[];
  @IsOptional()
  comment?: string;

  @IsEnum(OrderType)
  @IsOptional()
  type: OrderType = OrderType.LASER;
}
