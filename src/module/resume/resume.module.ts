import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeServise } from './resume.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeServise, AuthServise],
})
export class ResumeModule {}
