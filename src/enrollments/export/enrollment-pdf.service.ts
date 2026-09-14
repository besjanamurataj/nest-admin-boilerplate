import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class EnrollmentPdfService {
  async generateEnrollmentsPdf(enrollments: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
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
