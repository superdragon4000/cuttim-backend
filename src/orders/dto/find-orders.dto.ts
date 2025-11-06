import { IsDateString, IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { OrderStatus } from '../../model/order.entity';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOrdersQueryDto {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Фильтр по статусу заказа' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Начальная дата создания заказа' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Конечная дата создания заказа' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ type: Number, description: 'Сколько заказов вернуть' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ type: Number, description: 'Сколько заказов пропустить (для пагинации)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({ enum: ['id', 'totalPrice', 'status', 'created_at'], description: 'Поле для сортировки' })
  @IsOptional()
  @IsIn(['id', 'totalPrice', 'status', 'created_at'])
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: 'Направление сортировки' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';
}