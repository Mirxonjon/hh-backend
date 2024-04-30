import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create_response.dto';
import { UserEntity } from 'src/entities/user.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { LikesEntity } from 'src/entities/likes.entity';
import {  UpdateResponseDto } from './dto/update_response.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { generateRandomNumbers } from 'src/utils/utils';

@Injectable()
export class ResponseServise {

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
    const findResponse = await ResponseEntity.find({
      where: {
        responsed_user : {
          id : userId
         }
      },
      order:{
        create_data :'desc'
      } ,
      relations: {
        responsed_user :true,
      }
    });

    if (!findResponse) {
      throw new HttpException('likes not found', HttpStatus.NOT_FOUND);
    }

    return findResponse;
  }

  async findSort(userId :string , response: string) {
    const findRes = await ResponseEntity.find({
      where: {
       answer: response,
       responsed_user : {
        id : userId
       }
      },
      order:{
        create_data :'desc'
      } ,
      relations: {
        responsed_job : true
      }
    });

    if (!findRes) {
      throw new HttpException('likes not found', HttpStatus.NOT_FOUND);
    }

    return findRes;
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
    body: CreateResponseDto ,
  ) {
      const findUser = await UserEntity.findOne({
        where: {
          id: userId
        }
      })

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const findJob = await JobsEntity.findOne({
        where: {
          id: body.job_id
        }
      })

      if (!findJob) {
        throw new HttpException('job not found', HttpStatus.NOT_FOUND);
      }
    
        await ResponseEntity.createQueryBuilder()
        .insert()
        .into(ResponseEntity)
        .values({
          answer: generateRandomNumbers(1,2) == 1 ? 'rejected' : 'apply' ,
          responsed_job: findJob ,

        })
        .execute()
        .catch((e) => { 
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });

        return 
    
  }

  
  async update(
    id: string,
    body: UpdateResponseDto ,
  ) {
    const findJob = await JobsEntity.findOne({
      where: { id },
    });

    if (!findJob) {
      throw new HttpException('job Not Found', HttpStatus.NOT_FOUND);
    }

        const updated = await ResponseEntity.update(id, {
          answer: generateRandomNumbers(1,2) == 1 ? 'rejected' : 'apply' ,
          responsed_job: findJob ,

        });

        return updated;
    
  }

  async remove(id: string) {
    const findResponse = await ResponseEntity.findOne({
      where: { id },
    });

    if (!findResponse) {
      throw new HttpException('Job Not Found', HttpStatus.NOT_FOUND);
    }

    await ResponseEntity.delete({ id });
  }
}
