import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LikesEntity } from './likes.entity';
import { ResponseEntity } from './response.entity';


@Entity()
export class JobsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  }) 
  title: string;

  @Column({
      type: 'character varying',
  })
  org_name: string;

  @Column({
    type: 'character varying',
  })
  expriece: string;

  @Column({
    type: 'character varying',
  })
  requrements: string;

  @Column({
    type: 'character varying',
  })
  address: string;

  @Column({
    type: 'character varying',
  })
  phone: string;

  @Column({
    type: 'character varying',
  })
  email: string;

  @Column({
    type: 'character varying',
  })
  telegram: string;

  @Column({
      type: 'bigint',
  })
  salery_from: number;

  @Column({
    type: 'character varying',
    default:`som`
  })
  currency: string;
  
  @Column({
    type: 'character varying',
  })
  about: string;

  @Column({
    type: 'bigint',
    
  })
  seen: number;

  @Column({
    type: 'bigint',
  })
  rejects: number;

  @ManyToOne(() => UserEntity, user => user.my_jobs)
  userInfo: UserEntity

      
  @OneToMany(()  => LikesEntity , likes => likes.JobsLiked)
  likes: JobsEntity[]

  @OneToMany(()  => ResponseEntity , responses => responses.responsed_job )
  responses: JobsEntity[]

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

}
