import { Module } from '@nestjs/common';
import { userController } from './user.controller';
import { userServise } from './user.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [userController],
  providers: [userServise, AuthServise],
})
export class userModule {}
