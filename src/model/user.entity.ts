import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import Order from './order.entity';

export enum UserRole {
  CLIENT = 'client',
  MANAGER = 'manager',
}

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationTokenIssuedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastVerificationEmailSentAt: Date | null;
}

export default User;
