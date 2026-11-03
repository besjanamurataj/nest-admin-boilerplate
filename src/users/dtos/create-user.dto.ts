import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/roles/role.entity';
import { UserInfo } from 'src/userInfo/userInfo.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
  @IsNotEmpty()
  @IsString()
  name!: string;
  @IsNotEmpty()
  @IsString()
  surname!: string;
  @IsNotEmpty()
  @IsString()
  username!: string;
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  roles?: Role[];
  @IsOptional()
  userInfo?: UserInfo;
}
