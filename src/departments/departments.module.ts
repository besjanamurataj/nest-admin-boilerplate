import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { University } from 'src/universities/university.entity';
import { DepartmentController } from './departments.controller';
import { DepartmentService } from './departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, University])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
