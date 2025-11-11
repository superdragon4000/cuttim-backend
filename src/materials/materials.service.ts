import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
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
    const candidate = await this.materialsRepository.findOneBy({ name: dto.name, type: dto.type, thickness: dto.thickness, unit: dto.unit });
    if (candidate) throw new ConflictException('Материал с такими параметрами уже существует');

    return await this.materialsRepository.save(dto);
  }

  async getMaterialById(id: number): Promise<Material> {
    const material = await this.materialsRepository.findOneBy({ id: Equal(id),});  
    if (!material) throw new ConflictException('Материал не найден');
    
    return material;
  }
}
