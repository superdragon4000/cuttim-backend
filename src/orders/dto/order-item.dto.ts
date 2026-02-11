import { IsInt, Min } from 'class-validator';

export class OrderItemDto {
  @IsInt()
  fileId: number;

  @IsInt()
  materialId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
