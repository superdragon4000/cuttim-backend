import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import Order from '../model/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PricingModule } from '../pricing/pricing.module';
import { FilesModule } from '../files/files.module';
import { MaterialsModule } from '../materials/materials.module';
import OrderFile from '../model/orderFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([OrderFile]),
    UsersModule,
    PricingModule,
    FilesModule,
    MaterialsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
