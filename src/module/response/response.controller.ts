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
import { ResponseServise } from './response.service';
import { CreateResponseDto } from './dto/create_response.dto';
import {  UpdateResponseDto } from './dto/update_response.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders, CustomRequest } from 'src/types';
@Controller('Response')
@ApiTags('Response')
@ApiBearerAuth('JWT-auth')
export class ResponseController {
  readonly #_service: ResponseServise;
  constructor(service: ResponseServise) {
    this.#_service = service;
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string ) {   
    return await this.#_service.findOne(id);
  }

  
  // @UseGuards(jwtGuard) 
  // @Get('/all')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async findAll(
  //   @Request() req :CustomRequest ,
  // ) {
  //   return await this.#_service.findAll(req.userId);
  // }

  @UseGuards(jwtGuard) 
  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findsort(
    @Headers() header: CustomHeaders,
    @Query('type') type: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.findSort(header , type , pageNumber ,pageSize);
  }



  @UseGuards(jwtGuard) 
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
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Headers() header: CustomHeaders,
    @Body() createResponseDto: CreateResponseDto,
  ) {
    return await this.#_service.create(
      header,
      createResponseDto
    );
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        job_id: {
          type: 'string',
          default: 'asdfasfsfgfgsdfdf57547ff49e',
        },

      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    await this.#_service.update(
      id,
      updateResponseDto,
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
