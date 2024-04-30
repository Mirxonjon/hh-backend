import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  CreateResumeDto } from './dto/create_resume.dto';
import { UpdateResumeDto } from './dto/update_resume.dto';
import {  ResumeEntity } from 'src/entities/resumes.entity';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class ResumeServise {

  async findOne(id: string ) {
    const findResume = await ResumeEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findResume) {
      throw new HttpException('Aplication not found', HttpStatus.NOT_FOUND);
    }
  return findResume
  }

  

  async findAll() {
    const findResumes = await ResumeEntity.find({
      order:{
        create_data :'desc'
      }
    });

    if (!findResumes) {
      throw new HttpException('Resumes not found', HttpStatus.NOT_FOUND);
    }

    return findResumes;
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
    body: CreateResumeDto ,
  ) {
      const findUser = await UserEntity.findOne({
        where: {
          id: userId
        }
      })

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    
        await ResumeEntity.createQueryBuilder()
        .insert()
        .into(ResumeEntity)
        .values({
          title :body.title,
          skills :body.skills ,
          experinces : body.experinces ,
          salery_from: +body.salery_from,
          currency: body.currency ,
          about: body.about,
          user: findUser
        })
        .execute()
        .catch((e) => { 
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });

        return
    
  }

  
  async update(
    id: string,
    body: UpdateResumeDto ,
  ) {
    const findResume = await ResumeEntity.findOne({
      where: { id },
    });

    if (!findResume) {
      throw new HttpException('Resume Not Found', HttpStatus.NOT_FOUND);
    }

   
        const updated = await ResumeEntity.update(id, {
          title :body.title || findResume.title,
          skills :body.skills || findResume.skills ,
          experinces : body.experinces  || findResume.experinces ,
          salery_from: +body.salery_from || findResume.salery_from,
          currency: body.currency  || findResume.currency,
          about: body.about || findResume.about ,
        });

        return updated;
    
  }

  async remove(id: string) {
    const findResume = await ResumeEntity.findOne({
      where: { id },
    });

    if (!findResume) {
      throw new HttpException('Resume Not Found', HttpStatus.NOT_FOUND);
    }

    await ResumeEntity.delete({ id });
  }
}
