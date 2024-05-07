import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { userServise } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update_user.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders } from 'src/types';
@Controller('user')
@ApiTags('user')
@ApiBearerAuth('JWT-auth')
export class userController {
  readonly #_service: userServise;
  constructor(service: userServise) {
    this.#_service = service;
  }

  @Get('/one')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Headers() header: CustomHeaders) {
    return await this.#_service.findOne(header);
  }

  @UseGuards(jwtGuard)
  @Patch('/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: 'Elyor',
        },
        password: {
          type: 'string',
          default: '123',
        },
        email: {
          type: 'string',
          default: '123',
        },
        phone: {
          type: 'string',
          default: '123',
        },
        occupation: {
          type: 'string',
          default: '123',
        },
        image_link: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  async update(
    @Headers() header: CustomHeaders,
    @Body() updatePartnerDto: UpdateUserDto,
    files: { image?: Express.Multer.File },
  ) {
    await this.#_service.update(
      header,
      updatePartnerDto,
      files?.image ? files?.image[0] : null,
    );
  }

  @UseGuards(jwtGuard)
  @Delete('/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Headers() header: CustomHeaders): Promise<void> {
    await this.#_service.remove(header);
  }
}
