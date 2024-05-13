import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create_like.dto';

import { ResumeEntity } from 'src/entities/resumes.entity';
import { UserEntity } from 'src/entities/user.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { LikesEntity } from 'src/entities/likes.entity';
import { UpdateLikeDto } from './dto/update_like.dto';
import { CustomHeaders } from 'src/types';
import { AuthServise } from '../auth/auth.service';

@Injectable()
export class LikeServise {
  readonly #_auth: AuthServise;
  constructor(auth: AuthServise) {
    this.#_auth = auth;
  }

  async findOne(id: string) {
    const findLike = await LikesEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findLike) {
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    }
    return findLike;
  }

  async findAll(header: CustomHeaders, pageNumber = 1, pageSize = 10) {
    if (header.authorization) {
      const offset = (pageNumber - 1) * pageSize;
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;
      const [results, total] = await LikesEntity.findAndCount({
        where: {
          like: true,
          userLiked: {
            id: userId,
          },
        },
        order: {
          create_data: 'desc',
        },
        relations: {
          userLiked: true,
          JobsLiked: true,
        },
        skip: offset,
        take: pageSize,
      });

      if (!results) {
        throw new HttpException('likes not found', HttpStatus.NOT_FOUND);
      }
      const totalPages = Math.ceil(total / pageSize);

      return {
        results,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          pageSize,
          totalItems: total,
        },
      };
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
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

  async update(header: CustomHeaders, body: CreateLikeDto) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;
      const findlikes = await LikesEntity.findOne({
        where: {
          JobsLiked: {
            id: body.job_id,
          },
          userLiked: {
            id: userId,
          },
        },
        relations: {
          JobsLiked: true,
          userLiked: true,
        },
      });
      const findUser = await UserEntity.findOne({
        where: {
          id: userId,
        },
      });

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const findJob = await JobsEntity.findOne({
        where: {
          id: body.job_id,
        },
      });

      if (!findJob) {
        throw new HttpException('job not found', HttpStatus.NOT_FOUND);
      }

      if (!findlikes) {
        await LikesEntity.createQueryBuilder()
          .insert()
          .into(LikesEntity)
          .values({
            like: body.like,
            JobsLiked: findJob,
            userLiked: findUser,
          })
          .execute()
          .catch((e) => {
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });

        return;
      } else {
        const updated = await LikesEntity.update(findlikes.id, {
          like: body.like,
          JobsLiked: findJob,
        });

        return;
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
