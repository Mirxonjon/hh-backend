import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create_job.dto';
import { UpdateJobDto } from './dto/update_job.dto';
import { ResumeEntity } from 'src/entities/resumes.entity';
import { UserEntity } from 'src/entities/user.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { generateRandomNumbers } from 'src/utils/utils';
import { Like, MoreThan, MoreThanOrEqual } from 'typeorm';
import { LikesEntity } from 'src/entities/likes.entity';
import { ResponseEntity } from 'src/entities/response.entity';
import { CustomHeaders } from 'src/types';
import { AuthServise } from '../auth/auth.service';

@Injectable()
export class JobServise {
  readonly #_auth: AuthServise;
  constructor(auth: AuthServise) {
    this.#_auth = auth;
  }

  async findOne(id: string, header: CustomHeaders) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;

      const findJob = await JobsEntity.findOne({
        where: [
          {
            id,
          },
        ],
        relations: {
          // responses : true,
          // likes: true
        },
      }).catch((e) => {
        console.log('okk', e);

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
      if (!findJob) {
        throw new HttpException('Aplication not found', HttpStatus.NOT_FOUND);
      }

      const likes = await LikesEntity.findOne({
        where: {
          JobsLiked: {
            id: findJob.id,
          },
          userLiked: {
            id: userId,
          },
        },
      }).catch((e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      const responses = await ResponseEntity.findOne({
        where: {
          responsed_job: {
            id: findJob.id,
          },
          responsed_user: {
            id: userId,
          },
        },
      }).catch((e) => {
        console.log('okk', e);

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      return {
        ...findJob,
        likes,
        responses,
      };
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async findsortmyjobs(header: CustomHeaders, pageNumber = 1, pageSize = 10) {
    console.log(header, 'userid');

    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;

      const offset = (pageNumber - 1) * pageSize;

      const [results, total] = await JobsEntity.findAndCount({
        where: {
          userInfo: {
            id: userId,
          },
        },
        order: {
          create_data: 'desc',
        },
        relations: {
          // likes: true,
          userInfo: true,
        },
        skip: offset,
        take: pageSize,
      });
      // console.log(results);

      if (!results) {
        throw new HttpException('job not found', HttpStatus.NOT_FOUND);
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

  async findsort(
    title: string,
    org_name: string,
    salary: string,
    salary_type: string,
    popular: string,
    pageNumber = 1,
    pageSize = 10,
  ) {
    if (popular == 'all') {
      const offset = (pageNumber - 1) * pageSize;

      const [results, total] = await JobsEntity.findAndCount({
        where: {
          title: title != 'null' ? Like(`%${title}%`) : null,
          org_name: org_name != 'null' ? Like(`%${org_name}%`) : null,
          salery_from: salary != 'null' ? MoreThanOrEqual(+salary) : null,
          currency: salary_type != 'null' ? salary_type : null,
        },
        order: {
          create_data: 'desc',
        },
        relations: {
          userInfo: {
            mylikes: true,
          },
        },
        skip: offset,
        take: pageSize,
      });
      if (!results) {
        throw new HttpException('Sort not found', HttpStatus.NOT_FOUND);
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
      const offset = (pageNumber - 1) * pageSize;

      const [results, total] = await JobsEntity.findAndCount({
        where: {
          title: title != 'null' ? Like(`%${title}%`) : null,
          org_name: org_name != 'null' ? Like(`%${org_name}%`) : null,
          salery_from: salary != 'null' ? MoreThanOrEqual(+salary) : null,
          currency: salary_type != 'null' ? salary_type : null,
        },
        order: {
          rejects: 'desc',
        },
        relations: {
          likes: true,
        },
        skip: offset,
        take: pageSize,
      });
      if (!results) {
        throw new HttpException('Sort not found', HttpStatus.NOT_FOUND);
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
    }
  }

  async findAll() {
    const findJob = await JobsEntity.find({
      order: {
        create_data: 'desc',
      },
    });

    if (!findJob) {
      throw new HttpException('Resumes not found', HttpStatus.NOT_FOUND);
    }

    return findJob;
  }

  async create(header: CustomHeaders, body: CreateJobDto) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;
      const findUser = await UserEntity.findOne({
        where: {
          id: userId,
        },
      }).catch((e) => console.log(e));

      console.log(findUser);

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await JobsEntity.createQueryBuilder()
        .insert()
        .into(JobsEntity)
        .values({
          title: body.title,
          org_name: body.org_name,
          address: body.address,
          phone: body.phone,
          expriece: body.expriece,
          email: body.email,
          telegram: body.telegram,
          seen: generateRandomNumbers(1, 50),
          rejects: generateRandomNumbers(1, 100),
          requrements: body.requrements,
          salery_from: +body.salery_from,
          currency: body.currency,
          about: body.about,
          userInfo: findUser,
        })
        .execute()
        .catch((e) => {
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });

      return;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(id: string, body: UpdateJobDto) {
    const findJob = await JobsEntity.findOne({
      where: { id },
    });

    if (!findJob) {
      throw new HttpException('Resume Not Found', HttpStatus.NOT_FOUND);
    }

    const updated = await JobsEntity.update(id, {
      title: body.title || findJob.title,
      org_name: body.org_name || findJob.org_name,
      address: body.address || findJob.address,
      phone: body.phone || findJob.phone,
      expriece: body.expriece || findJob.expriece,
      email: body.email || findJob.email,
      telegram: body.telegram || findJob.telegram,
      seen: generateRandomNumbers(1, 50),
      rejects: generateRandomNumbers(1, 100),
      requrements: body.requrements || findJob.requrements,
      salery_from: +body.salery_from || findJob.salery_from,
      currency: body.currency || findJob.currency,
      about: body.about || findJob.about,
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
