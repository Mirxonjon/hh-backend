import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
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
import { CustomRequest } from 'src/types';
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
  async findOne(@Request() req: CustomRequest ) {
    return await this.#_service.findOne(req.userId);
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image' }]),
  )
  async update(
    @Request() req : CustomRequest,
    @Body() updatePartnerDto: UpdateUserDto,
    files: { image?: Express.Multer.File; },
  ) {
    await this.#_service.update(
      req.userId,
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
  async remove(
    @Request() req :CustomRequest
  ): Promise<void> {
    await this.#_service.remove(req.userId);
  }
}
