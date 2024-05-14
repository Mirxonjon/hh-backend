import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeEntity } from './resumes.entity';
import { JobsEntity } from './jobs.entity';
import { LikesEntity } from './likes.entity';
import { ResponseEntity } from './response.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  name: string;

  @Column({
    type: 'character varying',
  })
  password: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  image_link: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  occupation: string;

  @OneToMany(() => ResumeEntity, (resume) => resume.user)
  resumes: ResumeEntity[];

  @OneToMany(() => JobsEntity, (jobs) => jobs.userInfo ,)
  my_jobs: JobsEntity[];

  @OneToMany(() => LikesEntity, (likes) => likes.userLiked)
  mylikes: LikesEntity[];

  @OneToMany(() => ResponseEntity, (responses) => responses.responsed_user)
  responses: ResponseEntity[];

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
