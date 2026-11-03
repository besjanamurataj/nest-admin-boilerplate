import { IsOptional, IsString } from 'class-validator';

export class UserInfoDto {
  @IsOptional()
  @IsString()
  gender?: string;
  @IsOptional()
  @IsString()
  birthDate?: string;
  @IsOptional()
  @IsString()
  phoneNumber?: string;
  @IsOptional()
  @IsString()
  street?: string;
}
