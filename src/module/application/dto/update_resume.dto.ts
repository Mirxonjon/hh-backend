import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateResumeDto {
  @IsString()
  title: string;

  @IsString()
  skills: string;

  @IsString()
  experinces: string;

  @IsString()
  salery_from: string;

  @IsString()
  currency: string;
  
  @IsString()
  about: string;


}
