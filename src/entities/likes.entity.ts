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
  export class LikesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'boolean',
      default:true
    })
    like: boolean;

    @ManyToOne(() => UserEntity , user => user.mylikes)
    userLiked : UserEntity

    @ManyToOne(() => JobsEntity , user => user.likes)
    JobsLiked : JobsEntity
  
    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;
  
    
  }
  