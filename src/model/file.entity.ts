import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;
  
  @Column()
  storageName: string;
  
  @Column()
  fileUrl: string;

  @Column({ type: 'json', nullable: true })
  dxfMetadata: Record<string, any>;

  @Column({ type: 'float', nullable: true })
  width: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  areaMm2: number;
}

export default File;
