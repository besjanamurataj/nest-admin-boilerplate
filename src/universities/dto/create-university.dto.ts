import { IsEmail, IsString } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  city!: string;

  @IsEmail()
  email!: string;
}
