import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobServise } from './job.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [JobController],
  providers: [JobServise , AuthServise],
})
export class JobModule {}
