import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(200)
  password: string;
}
