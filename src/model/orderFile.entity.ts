import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import Order from './order.entity';
import Material from './material.entity';
import File from './file.entity';

@Entity()
class OrderFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => File)
  file: File;

  @ManyToOne(() => Material, (material) => material.orderFiles)
  material: Material;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float', nullable: true })
  calculatedPrice: number;

  @ManyToOne(() => Order, (order) => order.files)
  order: Order;
}


export default OrderFile;
