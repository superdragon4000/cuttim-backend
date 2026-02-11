import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import User from './user.entity';
import OrderFile from './orderFile.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FABRICATED = 'fabricated',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderType {
  LASER = 'laser',
  THREE_D = '3d',
}

export enum ShippingMethod {
  PICKUP = 'pickup',
  COURIER = 'courier',
  EXPRESS = 'express',
}

@Entity()
class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderType, default: OrderType.LASER })
  type: OrderType;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', nullable: true })
  recipientName: string;

  @Column({ type: 'text', nullable: true })
  recipientPhone: string;

  @Column({ type: 'text', nullable: true })
  shippingCountry: string;

  @Column({ type: 'text', nullable: true })
  shippingCity: string;

  @Column({ type: 'text', nullable: true })
  shippingAddressLine1: string;

  @Column({ type: 'text', nullable: true })
  shippingAddressLine2: string;

  @Column({ type: 'text', nullable: true })
  shippingPostalCode: string;

  @Column({
    type: 'enum',
    enum: ShippingMethod,
    default: ShippingMethod.COURIER,
  })
  shippingMethod: ShippingMethod;

  @Column({ type: 'float', default: 0 })
  shippingCost: number;

  @Column({ type: 'varchar', default: 'RUB' })
  currency: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  trackingAssignedAt: Date;

  @Column({type: 'float', nullable: true })
  totalPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  fabricatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  managerComment: string; // для админки: причина отмены, замечания

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderFile, (file) => file.order, { cascade: true })
  files: OrderFile[];
}

export default Order;
