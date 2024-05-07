import { IsString, IsBoolean } from 'class-validator';

export class UpdateResponseDto {
  @IsString()
  job_id: string;

  @IsString()
  response: string;
}
