import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  skills: string;

  @IsString()
  @IsNotEmpty()
  experinces: string;

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
