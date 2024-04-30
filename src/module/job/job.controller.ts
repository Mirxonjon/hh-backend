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
import { JobServise } from './job.service';
import { CreateJobDto } from './dto/create_job.dto';
import { UpdateJobDto } from './dto/update_job.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomRequest } from 'src/types';
@Controller('job')
@ApiTags('job')
@ApiBearerAuth('JWT-auth')
export class JobController {
  readonly #_service: JobServise;
  constructor(service: JobServise) {
    this.#_service = service;
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string ) {   
    return await this.#_service.findOne(id);
  }

  

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findAll() {
    return await this.#_service.findAll();
  }

  
  @Get('/sort')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  // @ApiOperation({ description : 'Bitta operatorni ish grafikini olish uchun Api. Login ga operator dasturga kirish raqami kiritiladi'})
  async findsort(
    @Query('title') title: string,
    @Query('orgname') orgname: string,
    @Query('salary') salary: string,
    @Query('salary_type') salary_type: string,
    @Query('popular') popular: string,
  ) {
    return await this.#_service.findsort(title ,orgname,salary , salary_type , popular);
  }

  @Get('/sort/myjobs')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  // @ApiOperation({ description : 'Bitta operatorni ish grafikini olish uchun Api. Login ga operator dasturga kirish raqami kiritiladi'})
  async findsortmyjobs(
    @Query('title') title: string,
    @Query('orgname') orgname: string,
    @Query('salary') salary: string,
    @Query('salary_type') salary_type: string,

    @Request() req :CustomRequest ,
  ) {
    return await this.#_service.findsortmyjobs(req.userId, title ,orgname,salary , salary_type);
  }




  @UseGuards(jwtGuard) 
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'title',
        'org_name',
        'address',
        'phone',
        'email',
        'requrements',
        'salery_from',
        'currency',
        'about'
      ],
      properties: {
        title: {
          type: 'string',
          default: 'Hamkor',
        },
        exprience: {
          type: 'string',
          default: 'skillar',
        },
        telegram: {
          type: 'string',
          default: 'skillar',
        },
        org_name: {
          type: 'string',
          default: 'skillar',
        },
        address: {
          type: 'string',
          default: 'skillar',
        },
        phone: {
          type: 'string',
          default: 'skillar',
        },
        email: {
          type: 'string',
          default: 'skillar',
        },
        requrements: {
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
        about: {
          type : 'string',
          default: 'haqida malumot'
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Request() req :CustomRequest ,
    @Body() createJobDto: CreateJobDto,
  ) {
    return await this.#_service.create(
      req.userId ,
      createJobDto
    );
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
        exprience: {
          type: 'string',
          default: 'skillar',
        },
        telegram: {
          type: 'string',
          default: 'skillar',
        },
        org_name: {
          type: 'string',
          default: 'skillar',
        },
        address: {
          type: 'string',
          default: 'skillar',
        },
        phone: {
          type: 'string',
          default: 'skillar',
        },
        email: {
          type: 'string',
          default: 'skillar',
        },
        requrements: {
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
        about: {
          type : 'string',
          default: 'haqida malumot'
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    await this.#_service.update(
      id,
      updateJobDto,
    );
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
