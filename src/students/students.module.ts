import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentService } from './students.service';
import { Department } from 'src/departments/department.entity';
import { StudentPdfService } from './student-pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Department])],
  controllers: [StudentsController],
  providers: [StudentService, StudentPdfService],
})
export class StudentsModule {}
