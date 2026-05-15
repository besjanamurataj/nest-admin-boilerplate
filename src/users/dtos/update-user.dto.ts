import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/roles/role.entity';
import { UserInfo } from 'src/userInfo/userInfo.entity';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  surname?: string;
  @IsString()
  @IsOptional()
  username?: string;
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  roles?: Role[];
  @IsOptional()
  userInfo?: UserInfo;
}
