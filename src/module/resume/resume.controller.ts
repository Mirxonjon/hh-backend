import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResumeServise } from './resume.service';
import { CreateResumeDto } from './dto/create_resume.dto';
import { UpdateResumeDto } from './dto/update_resume.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders, CustomRequest } from 'src/types';
@Controller('Resume')
@ApiTags('Resume')
@ApiBearerAuth('JWT-auth')
export class ResumeController {
  readonly #_service: ResumeServise;
  constructor(service: ResumeServise) {
    this.#_service = service;
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.findAll(pageNumber, pageSize);
  }

  // @Get('/sort')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // @ApiOperation({ description : 'Bitta operatorni ish grafikini olish uchun Api. Login ga operator dasturga kirish raqami kiritiladi'})
  // async findsort(
  //   @Query('type_of_service') type_of_service: string,
  // ) {
  //   return await this.#_service.findsort(type_of_service);
  // }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'title',
        'skills',
        'experinces',
        'salery_from',
        'currency',
        'About',
      ],
      properties: {
        title: {
          type: 'string',
          default: 'Hamkor',
        },
        skills: {
          type: 'string',
          default: 'skillar',
        },
        experinces: {
          type: 'string',
          default: 'Yetakchi mutaxasis ',
        },
        salery_from: {
          type: 'string',
          default: '80000',
        },
        currency: {
          type: 'string',
          default: 'dollar',
        },
        About: {
          type: 'string',
          default: 'haqida malumot',
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Headers() header: CustomHeaders,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    return await this.#_service.create(header, createResumeDto);
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          default: 'Hamkor',
        },
        skills: {
          type: 'string',
          default: 'skillar',
        },
        experinces: {
          type: 'string',
          default: 'Yetakchi mutaxasis ',
        },
        salery_from: {
          type: 'string',
          default: '80000',
        },
        currency: {
          type: 'string',
          default: 'dollar',
        },
        About: {
          type: 'string',
          default: 'haqida malumot',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    await this.#_service.update(id, updateResumeDto);
  }

  @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.remove(id);
  }
}
