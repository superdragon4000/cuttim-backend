import { IsInt, Min, ValidateNested } from 'class-validator';
import OrderFile from '../../model/orderFile.entity';
import { Type } from 'class-transformer';

export class CalculatePriceFilesDto {
  @IsInt()
  fileId: number;

  @IsInt()
  materialId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}


export class CalculatePriceDto {
  @ValidateNested({ each: true })
  @Type(() => CalculatePriceFilesDto)
  files: CalculatePriceFilesDto[];
}