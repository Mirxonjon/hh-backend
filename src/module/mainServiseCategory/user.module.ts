import { Module } from '@nestjs/common';
import { userController } from './user.controller';
import { userServise } from './user.service';


@Module({
  controllers: [userController],
  providers: [userServise],
})
export class userModule {}
