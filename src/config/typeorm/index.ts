import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import {  ResumeEntity } from 'src/entities/resumes.entity';
import {  ResponseEntity } from 'src/entities/response.entity';
import { LikesEntity,  } from 'src/entities/likes.entity';
import { JobsEntity } from 'src/entities/jobs.entity';

dotenv.config();

export const connectDb: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  password: String(process.env.DB_PASSWORD),
  username: process.env.DB_USERNAME,
  database: process.env.DATABASE,
  entities: [ 
    UserEntity,
    JobsEntity,
    LikesEntity,
    ResponseEntity ,
    ResumeEntity
  ],
  autoLoadEntities: true,
  synchronize: true,
};
