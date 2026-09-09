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

import { EnrollmentService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { GetEnrollmentsQueryDto } from './dto/get-enrollment.dto';
import { EnrollmentCsvService } from './export/enrollment-csv.service';
import { EnrollmentPdfService } from './export/enrollment-pdf.service';
import { BatchEnrollmentDto } from './dto/batch-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly enrollmentCsvService: EnrollmentCsvService,
    private readonly enrollmentPdfService: EnrollmentPdfService,
  ) {}

  @Post()
  createEnrollment(@Body() body: CreateEnrollmentDto) {
    return this.enrollmentService.create(body);
  }

  @Post('/batch/department')
  batchEnrollByDepartment(@Body() body: BatchEnrollmentDto) {
    return this.enrollmentService.batchEnrollByDepartment(body);
  }

  @Get('/export/csv')
  async exportCsv(
    @Query() query: GetEnrollmentsQueryDto,
    @Res() res: Response,
  ) {
    const enrollments = await this.enrollmentService.findAllForExport(query);

    const csvBuffer =
      this.enrollmentCsvService.generateEnrollmentsCsv(enrollments);

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="enrollments.csv"',
      'Content-Length': csvBuffer.length,
    });

    return res.end(csvBuffer);
  }

  @Get('/export/pdf')
  async exportPdf(
    @Query() query: GetEnrollmentsQueryDto,
    @Res() res: Response,
  ) {
    const enrollments = await this.enrollmentService.findAllForExport(query);

    const pdfBuffer =
      await this.enrollmentPdfService.generateEnrollmentsPdf(enrollments);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="enrollments.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    return res.end(pdfBuffer);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const enrollment = await this.enrollmentService.findOne(id);

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  @Get()
  async findAll(@Query() query: GetEnrollmentsQueryDto, @Res() res: Response) {
    const enrollments = await this.enrollmentService.findAll(query);

    return res.json(enrollments);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateEnrollmentDto>,
  ) {
    return this.enrollmentService.update(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.enrollmentService.remove(id);
  }
}
