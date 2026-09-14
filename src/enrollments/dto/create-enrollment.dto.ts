import { Type } from 'class-transformer';
import { IsDateString, IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @IsDateString()
  enrollmentDate!: string;

  @IsInt()
  @Type(() => Number)
  universityId!: number;

  @IsInt()
  @Type(() => Number)
  departmentId!: number;

  @IsInt()
  @Type(() => Number)
  studentId!: number;
}
