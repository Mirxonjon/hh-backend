import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeServise } from './like.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [LikeController],
  providers: [LikeServise, AuthServise],
})
export class LikeModule {}
