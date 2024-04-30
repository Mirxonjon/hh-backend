import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { deleteFileCloud, googleCloudAsync } from 'src/utils/google_cloud';
import {
  allowedImageFormats,
} from 'src/utils/videoAndImageFormat';

import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update_user.dto';

@Injectable()
export class userServise {

  async findOne(id: string  ) {
    const findUser = await UserEntity.findOne({ 
      where :{
        id 
      } ,
      order : {
        resumes:{
          create_data : 'desc'
        },
        my_jobs: {
          create_data: 'desc'
        }
            },
      relations : {
        resumes : true,
        my_jobs : true
      }
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  return findUser
  }


  async update(
    id : string,
    body: UpdateUserDto ,
    image: Express.Multer.File 
  ) {

      const findUser = await UserEntity.findOne({
      where: { id},
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
      let linkImage = findUser.image_link
        if(formatImage != 'Not image') {
         linkImage  = await googleCloudAsync(image);
      }



        const updated = await UserEntity.update(findUser.id, {
        phone : body.phone || findUser.phone,
        occupation: body.occupation || findUser.occupation,
        email: body.occupation || findUser.occupation,
        name :body.name || findUser.name,
        password: body.password || findUser.password,
        image_link : linkImage
        });

        return updated;

      }
  }

  async remove(id: string) {
    const findUser = await UserEntity.findOne({
      where: { id },
    });

    if (!findUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    await UserEntity.delete({ id:findUser.id });
  }
}
