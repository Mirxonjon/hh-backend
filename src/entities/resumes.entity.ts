import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class ResumeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  title: string;

  @Column({
    type: 'character varying',
  })
  skills: string;

  @Column({
    type: 'character varying',
  })
  experinces: string;

  @Column({
    type: 'bigint',
  })
  salery_from: number;

  @Column({
    type: 'character varying',
    default: `uzs`,
  })
  currency: string;

  @Column({
    type: 'character varying',
  })
  about: string;

  @ManyToOne(() => UserEntity, (user) => user.resumes)
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
