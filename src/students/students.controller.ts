import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { StudentService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { GetStudentsQueryDto } from './dto/get-student.dto';
import { StudentPdfService } from './student-pdf.service';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentService,
    private readonly studentPdfService: StudentPdfService
  ) { }

  @Post()
  createStudent(@Body() body: CreateStudentDto) {
    return this.studentsService.create(body);
  }

  @Get('/export/pdf')
  async exportPdf(@Query() query: GetStudentsQueryDto, @Res() res: Response) {
    const students = await this.studentsService.findAllForExport(query);

    const pdfBuffer =
      await this.studentPdfService.generateStudentsPdf(students);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="students.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    return res.end(pdfBuffer);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const student = await this.studentsService.findOne(id);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  @Get()
  async findAll(@Query() query: GetStudentsQueryDto, @Res() res: Response) {
    const students = await this.studentsService.findAll(query);

    return res.json(students);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateStudentDto>,
  ) {
    return this.studentsService.update(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
