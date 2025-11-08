import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor() {}
  async uploadFile(file: Express.Multer.File) {
    const metadata = await this.parseDxf(`./uploads/${file.filename}`);

    function calculateBoundingBox(entities: any[]) {
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

      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));
      const minY = Math.min(...points.map((p) => p.y));
      const maxY = Math.max(...points.map((p) => p.y));

      return { minX, maxX, minY, maxY };
    }
    function calculatePrice(
      entities: any[],
      pricePerMm2: number,
      quantity: number,
    ) {
      const box = calculateBoundingBox(entities);
      const width = box.maxX - box.minX;
      const height = box.maxY - box.minY;

      const areaMm2 = width * height;

      return {
        price: areaMm2 * pricePerMm2 * quantity,
        areaMm2: areaMm2,
        width: width,
        height: height,
      };
    }

    return {
      price: calculatePrice(
        metadata.entities,
        0.0011248, // цена за м2 в условных единицах
        1, // количество
      ),
    };
  }

  private async parseDxf(path: string): Promise<Record<string, any>> {
    // Используем библиотеку dxf-parser
    const DxfParser = require('dxf-parser');
    const fs = require('fs');

    const parser = new DxfParser();
    const data = parser.parseSync(fs.readFileSync(path, 'utf-8'));

    // Пример: извлекаем количество сущностей
    // return {
    //   entitiesCount: data.entities.length,
    //   layers: Object.keys(data.tables.layer),
    // };
    return data;
  }
}
