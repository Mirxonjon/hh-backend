import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseServise } from './response.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseServise, AuthServise],
})
export class ResponseModule {}
