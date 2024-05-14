import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create_response.dto';
import { UserEntity } from 'src/entities/user.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { LikesEntity } from 'src/entities/likes.entity';
import { UpdateResponseDto } from './dto/update_response.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { generateRandomNumbers } from 'src/utils/utils';
import { CustomHeaders } from 'src/types';
import { AuthServise } from '../auth/auth.service';

@Injectable()
export class ResponseServise {
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

  async findAll(userId: string) {
    const findResponse = await ResponseEntity.find({
      where: {
        responsed_user: {
          id: userId,
        },
      },
      order: {
        create_data: 'desc',
      },
      relations: {
        responsed_user: true,
      },
    });

    if (!findResponse) {
      throw new HttpException('likes not found', HttpStatus.NOT_FOUND);
    }

    return findResponse;
  }

  async findSort(
    header: CustomHeaders,
    type: string,
    pageNumber = 1,
    pageSize = 10,
  ) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;

      if (type == 'all') {
        const offset = (pageNumber - 1) * pageSize;

        const [results, total]: any = await ResponseEntity.findAndCount({
          where: {
            responsed_user: {
              id: userId,
            },
          },
          order: {
            create_data: 'desc',
          },
          relations: {
            responsed_job: true,
            responsed_user: true,
          },
          skip: offset,
          take: pageSize,
        });

        if (!results) {
          throw new HttpException('response not found', HttpStatus.NOT_FOUND);
        }

        const totalPages = Math.ceil(total / pageSize);
        let data = [];

        results.map((e) =>
          data.push({
            id: e.id,
            answer: e.answer,
            ...e.responsed_job,
            ...e.responsed_user,
          }),
        );

        return {
          results:data,
          pagination: {
            currentPage: pageNumber,
            totalPages,
            pageSize,
            totalItems: total,
          },
        };
      } else {
        const offset = (pageNumber - 1) * pageSize;

        const [results, total] = await ResponseEntity.findAndCount({
          where: {
            answer: type,
            responsed_user: {
              id: userId,
            },
          },
          order: {
            create_data: 'desc',
          },
          relations: {
            responsed_job: true,
            responsed_user: true,
          },
          skip: offset,
          take: pageSize,
        });

        if (!results) {
          throw new HttpException('response not found', HttpStatus.NOT_FOUND);
        }

        const totalPages = Math.ceil(total / pageSize);

        let data = [];

        results.map((e) =>
          data.push({
            id: e.id,
            answer: e.answer,
            ...e.responsed_job,
            ...e.responsed_user,
          }),
        );
        return {
          results :data,
          pagination: {
            currentPage: pageNumber,
            totalPages,
            pageSize,
            totalItems: total,
          },
        };
      }
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

  async create(header: CustomHeaders, body: CreateResponseDto) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;

      const findResponses = await ResponseEntity.findOne({
        where: {
          responsed_user: {
            id: body.job_id,
          },
          responsed_job: {
            id: userId,
          },
        },
      });

      if (!findResponses) {
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

        await ResponseEntity.createQueryBuilder()
          .insert()
          .into(ResponseEntity)
          .values({
            answer: generateRandomNumbers(1, 2) == 1 ? 'rejected' : 'offer',
            responsed_job: findJob,
            responsed_user: findUser,
          })
          .execute()
          .catch((e) => {
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });

        return;
      } else {
        throw new HttpException(
          'you alrady response found',
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(id: string, body: UpdateResponseDto) {
    const findJob = await JobsEntity.findOne({
      where: { id },
    });

    if (!findJob) {
      throw new HttpException('job Not Found', HttpStatus.NOT_FOUND);
    }

    const updated = await ResponseEntity.update(id, {
      answer: generateRandomNumbers(1, 2) == 1 ? 'rejected' : 'apply',
      responsed_job: findJob,
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
