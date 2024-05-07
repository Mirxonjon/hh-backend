import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { JobsEntity } from './jobs.entity';

@Entity()
export class ResponseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    default: 'rejected',
  })
  answer: string;

  @ManyToOne(() => UserEntity, (user) => user.responses)
  responsed_user: UserEntity;

  @ManyToOne(() => JobsEntity, (job) => job.responses)
  responsed_job: JobsEntity;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
