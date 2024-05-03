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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse, 
  ApiTags,
} from '@nestjs/swagger';
import { LikeServise } from './like.service';
import { CreateLikeDto } from './dto/create_like.dto';
import { UpdateLikeDto } from './dto/update_like.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders, CustomRequest } from 'src/types';
@Controller('like')
@ApiTags('like')
@ApiBearerAuth('JWT-auth')
export class LikeController {
  readonly #_service: LikeServise;
  constructor(service: LikeServise) {
    this.#_service = service;
  
  }



  // @Get('/one/:id')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async findOne(@Param('id') id: string ) {   
  //   return await this.#_service.findOne(id);
  // }

  
  // @UseGuards(jwtGuard) 
  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findAll(
    @Headers() header: CustomHeaders
  ) {
    return await this.#_service.findAll(header);
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



  // @UseGuards(jwtGuard) 
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'job_id',
        'like',
      ],
      properties: {
        job_id: {
          type: 'string',
          default: 'asdfasfsfgfgsdfdf57547ff49e',
        },
        like: {
          type: 'boolean',
          default: true ,
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    // @Request() req :CustomRequest ,
    @Body() createLikeDto: CreateLikeDto,
    @Headers() header: CustomHeaders
  ) {
    return await this.#_service.update(
      header,
      createLikeDto
    );
  }

  // @UseGuards(jwtGuard)
  // @Patch('/update/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       job_id: {
  //         type: 'string',
  //         default: 'asdfasfsfgfgsdfdf57547ff49e',
  //       },
  //       like: {
  //         type: 'boolean',
  //         default: true ,
  //       },
  //     },
  //   },
  // })
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateLikeDto: UpdateLikeDto,
  // ) {
  //   await this.#_service.update(
  //     id,
  //     updateLikeDto,
  //   );
  // }

  // @UseGuards(jwtGuard)
  // @Delete('/delete/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiNoContentResponse()
  // async remove(@Param('id') id: string): Promise<void> {
  //   await this.#_service.remove(id);
  // }
}
