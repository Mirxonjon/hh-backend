import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  CreateLikeDto } from './dto/create_like.dto';

import {  ResumeEntity } from 'src/entities/resumes.entity';
import { UserEntity } from 'src/entities/user.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { LikesEntity } from 'src/entities/likes.entity';
import { UpdateLikeDto } from './dto/update_like.dto';

@Injectable()
export class LikeServise {

  async findOne(id: string ) {
    const findLike = await LikesEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findLike) {
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    }
  return findLike
  }

  

  async findAll(userId :string) {
    const findLikes = await LikesEntity.find({
      where: {
        like :  true,
        userLiked: {
          id : userId ,
        }
      },
      order:{
        create_data :'desc'
      } ,
      relations: {
        userLiked :true,
      }
    });

    if (!findLikes) {
      throw new HttpException('likes not found', HttpStatus.NOT_FOUND);
    }

    return findLikes;
  }

  // async findsort(type: string) {
  //   const findAplication = await ApplicationEntity.find({
  //     where: {
  //       type_of_service: type == 'Все' ? null : type
  //     },
  //     order:{
  //       create_data :'desc'
  //     }
  //   });

  //   if (!findAplication) {
  //     throw new HttpException('Aplication not found', HttpStatus.NOT_FOUND);
  //   }

  //   return findAplication;
  // }


  async create(
    userId: string,
    body: CreateLikeDto ,
  ) {
      const findUser = await UserEntity.findOne({
        where: {
          id: userId
        }
      })

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const findJob = await LikesEntity.findOne({
        where: {
          id: body.job_id
        }
      })

      if (!findJob) {
        throw new HttpException('job not found', HttpStatus.NOT_FOUND);
      }
    
        await LikesEntity.createQueryBuilder()
        .insert()
        .into(LikesEntity)
        .values({
          like: body.like ,
          JobsLiked: findJob ,
          userLiked: findUser
        })
        .execute()
        .catch((e) => { 
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });

        return 
    
  }

  
  async update(
    id: string,
    body: UpdateLikeDto ,
  ) {
    const findJob = await JobsEntity.findOne({
      where: { id },
    });

    if (!findJob) {
      throw new HttpException('job Not Found', HttpStatus.NOT_FOUND);
    }

   
        const updated = await LikesEntity.update(id, {
          like: body.like ,
          JobsLiked: findJob ,
        });

        return updated;
    
  }

  async remove(id: string) {
    const findLikes = await LikesEntity.findOne({
      where: { id },
    });

    if (!findLikes) {
      throw new HttpException('Job Not Found', HttpStatus.NOT_FOUND);
    }

    await LikesEntity.delete({ id });
  }
}
