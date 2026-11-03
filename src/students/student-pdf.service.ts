import { Injectable } from '@nestjs/common';
import {
  PDFDocument,
  PageSizes,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';

type StudentPdfData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  active: boolean;
  departmentId: number;
  departmentName: string;
};

@Injectable()
export class StudentPdfService {
  async generateStudentsPdf(students: StudentPdfData[]): Promise<Buffer> {
    const pdfDocument = await PDFDocument.create();
    const regularFont = await pdfDocument.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDocument.embedFont(StandardFonts.HelveticaBold);

    const a4Width = PageSizes.A4[0];
    const a4Height = PageSizes.A4[1];

    const pageWidth = a4Height;
    const pageHeight = a4Width;

    const margin = 30;
    const rowHeight = 24;
    const headerHeight = 26;

    const columnWidths = {
      firstName: 90,
      lastName: 90,
      email: 190,
      birthDate: 90,
      active: 60,
      department: 200,
    };

    const tableWidth =
      columnWidths.firstName +
      columnWidths.lastName +
      columnWidths.email +
      columnWidths.birthDate +
      columnWidths.active +
      columnWidths.department;

    let page = pdfDocument.addPage([pageWidth, pageHeight]);

    let currentY = pageHeight - margin;

    const drawTitle = (currentPage: PDFPage, font: PDFFont, bold: PDFFont) => {
      currentPage.drawText('Students List', {
        x: margin,
        y: currentY,
        size: 18,
        font: bold,
      });

      currentY -= 25;

      currentPage.drawText(`Generated: ${new Date().toLocaleString()}`, {
        x: margin,
        y: currentY,
        size: 9,
        font,
      });

      currentY -= 25;
    };

    const drawTableHeader = (currentPage: PDFPage, bold: PDFFont) => {
      let currentX = margin;

      currentPage.drawRectangle({
        x: margin,
        y: currentY - headerHeight + 6,
        width: tableWidth,
        height: headerHeight,
        color: rgb(0.94, 0.94, 0.94),
      });

      currentPage.drawText('First Name', {
        x: currentX + 4,
        y: currentY - 10,
        size: 9,
        font: bold,
      });

      currentX += columnWidths.firstName;

      currentPage.drawText('Last Name', {
        x: currentX + 4,
        y: currentY - 10,
        size: 9,
        font: bold,
      });

      currentX += columnWidths.lastName;

      currentPage.drawText('Email', {
        x: currentX + 4,
        y: currentY - 10,
        size: 9,
        font: bold,
      });

      currentX += columnWidths.email;

      currentPage.drawText('Birth Date', {
        x: currentX + 4,
        y: currentY - 10,
        size: 9,
        font: bold,
      });

      currentX += columnWidths.birthDate;

      currentPage.drawText('Active', {
        x: currentX + 4,
        y: currentY - 10,
        size: 9,
        font: bold,
      });

      currentX += columnWidths.active;

      currentPage.drawText('Department', {
        x: currentX + 4,
        y: currentY - 10,
        size: 9,
        font: bold,
      });

      currentY -= headerHeight;

      currentPage.drawLine({
        start: {
          x: margin,
          y: currentY + 5,
        },
        end: {
          x: margin + tableWidth,
          y: currentY + 5,
        },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      });
    };

    const addNewPage = () => {
      page = pdfDocument.addPage([pageWidth, pageHeight]);

      currentY = pageHeight - margin;

      drawTableHeader(page, boldFont);
    };

    drawTitle(page, regularFont, boldFont);
    drawTableHeader(page, boldFont);

    if (students.length === 0) {
      page.drawText('No students available.', {
        x: margin,
        y: currentY - 10,
        size: 10,
        font: regularFont,
      });
    }

    for (const student of students) {
      if (currentY - rowHeight < margin) {
        addNewPage();
      }

      let currentX = margin;

      page.drawText(student.firstName ?? '', {
        x: currentX + 4,
        y: currentY - 12,
        size: 9,
        font: regularFont,
        maxWidth: columnWidths.firstName - 8,
      });

      currentX += columnWidths.firstName;

      page.drawText(student.lastName ?? '', {
        x: currentX + 4,
        y: currentY - 12,
        size: 9,
        font: regularFont,
        maxWidth: columnWidths.lastName - 8,
      });

      currentX += columnWidths.lastName;

      page.drawText(student.email ?? '', {
        x: currentX + 4,
        y: currentY - 12,
        size: 9,
        font: regularFont,
        maxWidth: columnWidths.email - 8,
      });

      currentX += columnWidths.email;

      page.drawText(student.birthDate ?? '', {
        x: currentX + 4,
        y: currentY - 12,
        size: 9,
        font: regularFont,
        maxWidth: columnWidths.birthDate - 8,
      });

      currentX += columnWidths.birthDate;

      page.drawText(student.active ? 'Yes' : 'No', {
        x: currentX + 4,
        y: currentY - 12,
        size: 9,
        font: regularFont,
        maxWidth: columnWidths.active - 8,
      });

      currentX += columnWidths.active;

      page.drawText(student.departmentName ?? '', {
        x: currentX + 4,
        y: currentY - 12,
        size: 9,
        font: regularFont,
        maxWidth: columnWidths.department - 8,
      });

      currentY -= rowHeight;

      page.drawLine({
        start: {
          x: margin,
          y: currentY + 5,
        },
        end: {
          x: margin + tableWidth,
          y: currentY + 5,
        },
        thickness: 0.3,
        color: rgb(0.8, 0.8, 0.8),
      });
    }

    const pdfBytes = await pdfDocument.save();

    return Buffer.from(pdfBytes);
  }
}
