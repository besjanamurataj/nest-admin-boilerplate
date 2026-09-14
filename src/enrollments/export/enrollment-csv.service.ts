import { Injectable } from '@nestjs/common';

@Injectable()
export class EnrollmentCsvService {
  generateEnrollmentsCsv(enrollments: any[]): Buffer {
    const headers = [
      'ID',
      'Enrollment Date',
      'University',
      'Department',
      'Student First Name',
      'Student Last Name',
    ];

    const rows = enrollments.map((enrollment) => [
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

  private escapeCsvValue(value: unknown): string {
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
