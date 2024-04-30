import { IsString, IsBoolean } from 'class-validator';

export class UpdateLikeDto {
  @IsString()
  job_id: string;

  @IsBoolean()
  like: boolean
}
