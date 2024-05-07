import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  title: string;

  @IsString()
  org_name: string;

  @IsString()
  expriece: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  telegram: string;

  @IsString()
  requrements: string;

  @IsString()
  salery_from: string;

  @IsString()
  currency: string;

  @IsString()
  about: string;
}
