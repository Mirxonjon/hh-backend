import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobServise } from './job.service';

@Module({
  controllers: [JobController],
  providers: [JobServise],
})
export class JobModule {}
