import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsInt()
  @Type(() => Number)
  universityId!: number;

  @IsString()
  description!: string;
}
