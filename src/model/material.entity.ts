import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import OrderFile from './orderFile.entity';

export enum ThicknessUnit {
  MM = 'mm',
  CM = 'cm',
  INCH = 'inch',
}

@Entity()
class Material extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // например, "Steel"

  @Column({ type: 'float' })
  thickness: number;

  @Column({ type: 'enum', enum: ThicknessUnit, default: ThicknessUnit.MM })
  unit: ThicknessUnit;

  @Column({ type: 'float' })
  pricePerUnit: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => OrderFile, (orderFile) => orderFile.material)
  orderFiles: OrderFile[];
}

export default Material;
