import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '../../model/order.entity';

export class FindOrdersQueryDto {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Фильтр по статусу заказа' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Фильтр по статусу оплаты' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Начальная дата создания заказа',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Конечная дата создания заказа',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ type: Number, description: 'Сколько заказов вернуть' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Сколько заказов пропустить (для пагинации)',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({
    enum: ['id', 'totalPrice', 'status', 'paymentStatus', 'created_at'],
    description: 'Поле для сортировки',
  })
  @IsOptional()
  @IsIn(['id', 'totalPrice', 'status', 'paymentStatus', 'created_at'])
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: 'Направление сортировки' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    type: Number,
    description: 'Фильтр по ID пользователя (для менеджера)',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;
}
