import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import File from '../model/file.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const metadata = await this.parseDxf(`./uploads/${file.filename}`);

    const dimensions = this.calculateDimensions(metadata.entities);

    return await this.fileRepository.save({
      originalName: file.originalname,
      storageName: file.filename,
      fileUrl: `/uploads/${file.filename}`,
      // dxfMetadata: metadata,
      width: dimensions.width,
      height: dimensions.height,
      areaMm2: dimensions.areaMm2,
    });
  }

  async findFileById(fileId: number): Promise<File> {
    const file = await this.fileRepository.findOneBy({ id: Equal(fileId) });
    if (!file) {
      throw new NotFoundException('Файл не найден');
    }
    return file;
  }

  private async parseDxf(path: string): Promise<Record<string, any>> {
    const DxfParser = require('dxf-parser');
    const fs = require('fs');

    const parser = new DxfParser();
    const data = parser.parseSync(fs.readFileSync(path, 'utf-8'));

    return data;
  }

  private calculateBoundingBox(entities: any[]) {
    const points: { x: number; y: number }[] = [];
    for (const e of entities) {
      if (e.controlPoints) {
        points.push(...e.controlPoints);
      }
      if (e.vertices) {
        points.push(...e.vertices);
      }
      if (e.points) {
        points.push(...e.points);
      }
    }
    if (!points.length) {
      throw new BadRequestException(
        'DXF does not contain supported geometry points for dimension calculation',
      );
    }
    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));
    return { minX, maxX, minY, maxY };
  }

  private calculateDimensions(entities: any[]) {
    const box = this.calculateBoundingBox(entities);
    const width = box.maxX - box.minX;
    const height = box.maxY - box.minY;
    const areaMm2 = width * height;
    return { width, height, areaMm2 };
  }
}
