import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import Order from './order.entity';
import Material from './material.entity';

@Entity()
class OrderFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'json', nullable: true })
  dxfMetadata: Record<string, any>;

  @Column({ type: 'int' })
  quantity: number; // сколько штук этого файла заказано

  @ManyToOne(() => Material, (material) => material.files)
  material: Material;

  @Column({ type: 'float', nullable: true })
  calculatedPrice: number;

  @ManyToOne(() => Order, (order) => order.files)
  order: Order;
}

export default OrderFile;
