import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { EnrollmentExportRow } from './enrollment-export-row.interface';

interface PdfTextOptions {
  align?: 'left' | 'center' | 'right' | 'justify';
  width?: number;
}

interface PdfPageOptions {
  margin?: number;
  size?: string;
  layout?: 'portrait' | 'landscape';
}

// pdfkit does not ship TypeScript declarations, so describe the subset we use.
interface PdfDocument {
  y: number;
  on(event: 'data', listener: (chunk: Buffer) => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  font(name: string): this;
  fontSize(size: number): this;
  text(text: string, options?: PdfTextOptions): this;
  text(text: string, x?: number, y?: number, options?: PdfTextOptions): this;
  moveDown(lines?: number): this;
  moveTo(x: number, y: number): this;
  lineTo(x: number, y: number): this;
  stroke(): this;
  addPage(options?: PdfPageOptions): this;
  end(): void;
}

type PdfDocumentConstructor = new (options?: PdfPageOptions) => PdfDocument;

const PdfKitDocument = PDFDocument as PdfDocumentConstructor;

@Injectable()
export class EnrollmentPdfService {
  async generateEnrollmentsPdf(
    enrollments: EnrollmentExportRow[],
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PdfKitDocument({
        margin: 30,
        size: 'A4',
        layout: 'landscape',
      });

      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => {
        buffers.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on('error', (error) => {
        reject(error);
      });

      doc.fontSize(18).text('Enrollments Report', {
        align: 'center',
      });

      doc.moveDown(2);

      const columns = {
        id: 30,
        enrollmentDate: 70,
        university: 170,
        department: 330,
        firstName: 500,
        lastName: 640,
      };

      doc.fontSize(10).font('Helvetica-Bold');

      doc.text('ID', columns.id);
      doc.text('Enrollment Date', columns.enrollmentDate);
      doc.text('University', columns.university);
      doc.text('Department', columns.department);
      doc.text('First Name', columns.firstName);
      doc.text('Last Name', columns.lastName);

      doc.moveDown();

      let y = doc.y;

      doc.moveTo(30, y).lineTo(810, y).stroke();

      y += 10;

      doc.font('Helvetica').fontSize(9);

      enrollments.forEach((enrollment) => {
        if (y > 540) {
          doc.addPage({
            size: 'A4',
            layout: 'landscape',
            margin: 30,
          });

          y = 40;

          doc.font('Helvetica-Bold').fontSize(10);

          doc.text('ID', columns.id, y);
          doc.text('Enrollment Date', columns.enrollmentDate, y);
          doc.text('University', columns.university, y);
          doc.text('Department', columns.department, y);
          doc.text('First Name', columns.firstName, y);
          doc.text('Last Name', columns.lastName, y);

          y += 20;

          doc.font('Helvetica').fontSize(9);
        }

        doc.text(String(enrollment.id ?? ''), columns.id, y);

        doc.text(enrollment.enrollmentDate ?? '', columns.enrollmentDate, y);

        doc.text(enrollment.universityName ?? '', columns.university, y, {
          width: 140,
        });

        doc.text(enrollment.departmentName ?? '', columns.department, y, {
          width: 150,
        });

        doc.text(enrollment.studentFirstName ?? '', columns.firstName, y, {
          width: 120,
        });

        doc.text(enrollment.studentLastName ?? '', columns.lastName, y, {
          width: 120,
        });

        y += 25;
      });

      doc.end();
    });
  }
}
