import { Injectable } from '@nestjs/common';
import { EnrollmentExportRow } from './enrollment-export-row.interface';

type CsvValue = string | number | null | undefined;

@Injectable()
export class EnrollmentCsvService {
  generateEnrollmentsCsv(enrollments: EnrollmentExportRow[]): Buffer {
    const headers = [
      'ID',
      'Enrollment Date',
      'University',
      'Department',
      'Student First Name',
      'Student Last Name',
    ];

    const rows = enrollments.map((enrollment): CsvValue[] => [
      enrollment.id,
      `="${enrollment.enrollmentDate}"`,
      enrollment.universityName,
      enrollment.departmentName,
      enrollment.studentFirstName,
      enrollment.studentLastName,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((value) => this.escapeCsvValue(value)).join(','),
      ),
    ].join('\n');

    return Buffer.from(csvContent, 'utf-8');
  }

  private escapeCsvValue(value: CsvValue): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    if (
      stringValue.includes(',') ||
      stringValue.includes('"') ||
      stringValue.includes('\n')
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}
