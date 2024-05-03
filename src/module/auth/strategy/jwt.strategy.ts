import {
  HttpException,
  HttpStatus,
  Inject,
  Request,
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

  async validate( payload: any , @Request() request:CustomRequest ) {
    console.log(await payload.id  ,'aaaa')

    const findUser = await UserEntity.findOne({
      where: {
        id: payload.id ,  
      },
    }).catch(e => console.log(e)
    );
    console.log( payload ,findUser , 'aaaaaaaaa' );
    

    if (!findUser) {
      throw new HttpException('You are not login', HttpStatus.NOT_FOUND);
    }
    request.userId  = findUser.id 

    
    return findUser.id;
  }
}
