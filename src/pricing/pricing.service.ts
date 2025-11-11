import { Injectable, NotFoundException } from '@nestjs/common';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { MaterialsService } from '../materials/materials.service';
import { FilesService } from '../files/files.service';
import Material from '../model/material.entity';
import File from '../model/file.entity';

@Injectable()
export class PricingService {
  constructor(
    private materialsService: MaterialsService,
    private filesService: FilesService,
  ) {}

  async calculatePrice(dto: CalculatePriceDto) {
    let total = 0;
    for (const f of dto.files) {
      const file = await this.filesService.findFileById(f.fileId);
      if (!file) throw new NotFoundException(`File ${f.fileId} not found`);

      const material = await this.materialsService.getMaterialById(
        f.materialId,
      );
      if (!material)
        throw new NotFoundException(`Material ${f.materialId} not found`);

      // считаем цену
      const price = this.calculate(file, material, f.quantity);

      total += price;
    }
    return total;
  }

  calculate(file: File, material: Material, quantity: number) {
    return file.areaMm2 * material.pricePerSquareMm * quantity;
  }
}
