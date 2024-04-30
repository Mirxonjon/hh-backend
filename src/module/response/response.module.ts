import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseServise } from './response.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseServise],
})
export class ResponseModule {}
