import { IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(200)
  password: string;

  @IsString()
  email: string;

  @IsString()
  @MaxLength(200)
  phone: string;

  @IsString()
  @MaxLength(200)
  occupation: string;
}
