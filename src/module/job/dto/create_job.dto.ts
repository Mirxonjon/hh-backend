import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  org_name: string;

  @IsString()
  @IsNotEmpty()
  expriece: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telegram: string;

  @IsString()
  @IsNotEmpty()
  requrements: string;

  @IsString()
  @IsNotEmpty()
  salery_from: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  about: string;
}
