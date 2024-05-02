import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {  UserEntity } from 'src/entities/user.entity';
import { CustomRequest } from 'src/types';

export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      PassReqToCallback: true,
      pass: true,
    });
  }

  async validate(req: CustomRequest, payload: any) {

    const findUser = await UserEntity.findOne({
      where: {
        id: payload.id ,
      },
    });
    // console.log(findUser);
    

    if (!findUser) {
      throw new HttpException('You are not login', HttpStatus.NOT_FOUND);
    }
    req.userId  = findUser.id
    // console.log(req.userId , findUser.id);
    
    return '1';
  }
}
