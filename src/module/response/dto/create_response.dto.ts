import { IsString, IsNotEmpty, MaxLength, IsBoolean } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  
}
