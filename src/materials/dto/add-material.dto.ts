import { ApiProperty } from '@nestjs/swagger';
import { ThicknessUnit } from '../../model/material.entity';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddMaterialDto {
  @ApiProperty({
    description: 'Название материала',
    example: 'Алюминий',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Тип материала',
    example: '6061-T6',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Толщина материала',
    example: 2.5,
  })
  @IsNumber()
  @Min(0.01)
  thickness: number;

  @ApiProperty({
    description: 'Единица измерения толщины',
    enum: ThicknessUnit,
    example: ThicknessUnit.MM,
  })
  @IsEnum(ThicknessUnit)
  unit: ThicknessUnit;

  @ApiProperty({
    description: 'Цена за единицу толщины',
    example: 15.75,
  })
  @IsNumber()
  @Min(0)
  pricePerSquareMm: number;

  @ApiProperty({
    description: 'Описание материала',
    example: 'Листовой алюминий, подходит для лазерной резки',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
