import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  CreateJobDto } from './dto/create_job.dto';
import { UpdateJobDto } from './dto/update_job.dto';
import {  ResumeEntity } from 'src/entities/resumes.entity';
import { UserEntity } from 'src/entities/user.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { generateRandomNumbers } from 'src/utils/utils';
import { Like, MoreThan, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class JobServise {

  async findOne(id: string ) {
    const findJob = await JobsEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findJob) {
      throw new HttpException('Aplication not found', HttpStatus.NOT_FOUND);
    }
  return findJob
  }


  async findsort(title: string , org_name: string , salary : string ) {
    const findJob = await JobsEntity.find({
      where :{
        title: title != 'null' ? Like(`%${title}%`) : null,
        org_name: org_name != 'null' ? Like(`%${org_name}%`) : null,
        salery_from : salary != 'null' ? MoreThanOrEqual(+salary) : null
      },
      order:{
        create_data :'desc'
      }
    });
    if (!findJob) {
      throw new HttpException('Sort not found', HttpStatus.NOT_FOUND);
    } 
    return findJob;
  }
  

  async findAll() {
    const findJob = await JobsEntity.find({
      order:{
        create_data :'desc'
      }
    });

    if (!findJob) {
      throw new HttpException('Resumes not found', HttpStatus.NOT_FOUND);
    }

    return findJob;
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
    body: CreateJobDto ,
  ) {
      const findUser = await UserEntity.findOne({
        where: {
          id: userId
        }
      })

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    
        await JobsEntity.createQueryBuilder()
        .insert()
        .into(JobsEntity)
        .values({
          title :body.title ,
           org_name: body.org_name ,
           address : body.address ,
           phone: body.phone  ,
           email: body.email ,
           telegram: body.telegram ,
           seen : generateRandomNumbers(1 ,50),
           rejects:  generateRandomNumbers(1 ,100),
          requrements : body.requrements ,
          salery_from: +body.salery_from ,
          currency: body.currency ,
          about: body.about ,
        })
        .execute()
        .catch((e) => { 
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });

        return
    
  }

  
  async update(
    id: string,
    body: UpdateJobDto ,
  ) {
    const findJob = await JobsEntity.findOne({
      where: { id },
    });

    if (!findJob) {
      throw new HttpException('Resume Not Found', HttpStatus.NOT_FOUND);
    }

   
        const updated = await JobsEntity.update(id, {
          title :body.title || findJob.title,
           org_name: body.org_name || findJob.org_name,
           address : body.address || findJob.address,
           phone: body.phone  || findJob.phone,
           email: body.email || findJob.email,
           telegram: body.telegram || findJob.telegram,
           seen : generateRandomNumbers(1 ,50),
           rejects:  generateRandomNumbers(1 ,100),
          requrements : body.requrements || findJob.requrements ,
          salery_from: +body.salery_from || findJob.salery_from,
          currency: body.currency  || findJob.currency,
          about: body.about || findJob.about ,
        });

        return updated;
    
  }

  async remove(id: string) {
    const findJob = await JobsEntity.findOne({
      where: { id },
    });

    if (!findJob) {
      throw new HttpException('Job Not Found', HttpStatus.NOT_FOUND);
    }

    await JobsEntity.delete({ id });
  }
}
