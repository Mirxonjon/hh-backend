import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { deleteFileCloud, googleCloudAsync } from 'src/utils/google_cloud';
import { allowedImageFormats } from 'src/utils/videoAndImageFormat';

import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update_user.dto';
import { CustomHeaders } from 'src/types';
import { AuthServise } from '../auth/auth.service';

@Injectable()
export class userServise {
  readonly #_auth: AuthServise;
  constructor(auth: AuthServise) {
    this.#_auth = auth;
  }
  async findOne(header: CustomHeaders) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;
      const findUser = await UserEntity.findOne({
        where: {
          id: userId,
        },
        order: {
          resumes: {
            create_data: 'desc',
          },
          my_jobs: {
            create_data: 'desc',
          },
        },
        relations: {
          resumes: true,
          my_jobs: true,
        },
      }).catch(() => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
      if (!findUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      return findUser;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(
    header: CustomHeaders,
    body: UpdateUserDto,
    image: Express.Multer.File,
  ) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;

      const findUser = await UserEntity.findOne({
        where: { id: userId },
      });

      if (!findUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      let formatImage: string = 'Not image';

      if (image) {
        formatImage = extname(image.originalname).toLowerCase();
      }

      if (
        allowedImageFormats.includes(formatImage) ||
        formatImage === 'Not image'
      ) {
        let linkImage = findUser.image_link;
        if (formatImage != 'Not image') {
          linkImage = await googleCloudAsync(image);
        }

        const updated = await UserEntity.update(findUser.id, {
          phone: body.phone || findUser.phone,
          occupation: body.occupation || findUser.occupation,
          email: body.occupation || findUser.email,
          name: body.name || findUser.name,
          password: body.password || findUser.password,
          image_link: linkImage,
        });

        return updated;
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async remove(header: CustomHeaders) {
    if (header.authorization) {
      const data = await this.#_auth.verify(header.authorization.split(' ')[1]);
      const userId = data.id;
      const findUser = await UserEntity.findOne({
        where: { id: userId },
      });

      if (!findUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      await UserEntity.delete({ id: findUser.id });
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
