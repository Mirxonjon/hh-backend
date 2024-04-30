import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeServise } from './like.service';

@Module({
  controllers: [LikeController],
  providers: [LikeServise],
})
export class LikeModule {}
