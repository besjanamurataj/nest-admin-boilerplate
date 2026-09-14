import { Type } from 'class-transformer';
import { IsDateString, IsInt } from 'class-validator';

export class BatchEnrollmentDto {
  @IsInt()
  @Type(() => Number)
  departmentId!: number;

  @IsDateString()
  enrollmentDate!: string;
}
