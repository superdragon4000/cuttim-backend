import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { MaterialsModule } from '../materials/materials.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [MaterialsModule, FilesModule],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
