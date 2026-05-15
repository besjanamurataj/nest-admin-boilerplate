import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetUsersQueryDto {
  @IsOptional()
  @IsNumberString()
  number?: string;

  @IsOptional()
  @IsNumberString()
  size?: string;

  @IsOptional()
  @IsString()
  sort?: string;
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
