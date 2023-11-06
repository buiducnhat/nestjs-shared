import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class FullAuditedEntity extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdById: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true })
  updatedById?: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedById?: number;
}
