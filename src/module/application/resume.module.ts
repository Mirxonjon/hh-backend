import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeServise } from './resume.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeServise],
})
export class ResumeModule {}
