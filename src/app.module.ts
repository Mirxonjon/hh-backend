import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';
import { AuthModule } from './module/auth/auth.module';
import {  ResumeModule } from './module/application/resume.module';
import {  userModule } from './module/mainServiseCategory/user.module';
import { JobModule } from './module/job/job.module';
import { LikeModule } from './module/like/like.module';
import { ResponseModule } from './module/response/response.module';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    AuthModule,
    ResumeModule,
    userModule,
    JobModule,
    LikeModule,
    ResponseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
