import { IsString, IsNotEmpty, MaxLength, IsBoolean } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsBoolean()
  @IsNotEmpty()
  like: boolean;
}
