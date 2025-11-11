import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import Material from '../model/material.entity';
import { AddMaterialDto } from './dto/add-material.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  getAllMaterials(): Promise<Material[]> {
    return this.materialsService.getAllMaterials();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Post('add')
  @ApiOperation({ summary: 'Добавить новый материал' })
  @ApiResponse({ status: 201, description: 'Материал успешно добавлен' })
  @ApiResponse({ status: 409, description: 'Материал уже существует' })
  addMaterial(@Body() dto: AddMaterialDto): Promise<Material> {
    return this.materialsService.addMaterial(dto);
  }
}
