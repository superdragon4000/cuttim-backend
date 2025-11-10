import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Material from '../model/material.entity';
import { AddMaterialDto } from './dto/add-material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialsRepository: Repository<Material>,
  ) {}

  async getAllMaterials(): Promise<Material[]> {
    return this.materialsRepository.find();
  }

  async addMaterial(dto: AddMaterialDto): Promise<Material> {
    const candidate = await this.materialsRepository.findOneBy({ name: dto.name, thickness: dto.thickness, unit: dto.unit });
    if (candidate) throw new ConflictException('Материал с такими параметрами уже существует');

    return await this.materialsRepository.save(dto);
  }
}
