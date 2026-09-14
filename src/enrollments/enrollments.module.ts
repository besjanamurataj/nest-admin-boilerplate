import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Enrollment } from './enrollment.entity';
import { University } from 'src/universities/university.entity';
import { Department } from 'src/departments/department.entity';
import { Student } from 'src/students/student.entity';

import { EnrollmentService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentCsvService } from './export/enrollment-csv.service';
import { EnrollmentPdfService } from './export/enrollment-pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, University, Department, Student]),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentService, EnrollmentPdfService, EnrollmentCsvService],
})
export class EnrollmentsModule {}
