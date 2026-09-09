import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsDateString()
  birthDate!: string;

  @IsBoolean()
  @Type(() => Boolean)
  active!: boolean;

  @IsInt()
  @Type(() => Number)
  departmentId!: number;
}
