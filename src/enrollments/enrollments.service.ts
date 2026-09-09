import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Enrollment } from './enrollment.entity';
import { University } from 'src/universities/university.entity';
import { Department } from 'src/departments/department.entity';
import { Student } from 'src/students/student.entity';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { GetEnrollmentsQueryDto } from './dto/get-enrollment.dto';
import { BatchEnrollmentDto } from './dto/batch-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(body: CreateEnrollmentDto) {
    const { universityId, departmentId, studentId, ...enrollmentData } = body;

    const university = await this.universityRepository.findOneBy({
      id: universityId,
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const student = await this.studentRepository.findOneBy({
      id: studentId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const enrollment = this.enrollmentRepository.create({
      ...enrollmentData,
      university,
      department,
      student,
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    return {
      id: savedEnrollment.id,
      enrollmentDate: savedEnrollment.enrollmentDate,
      universityId: savedEnrollment.universityId,
      universityName: savedEnrollment.universityName,
      departmentId: savedEnrollment.departmentId,
      departmentName: savedEnrollment.departmentName,
      studentId: savedEnrollment.studentId,
      studentFirstName: savedEnrollment.studentFirstName,
      studentLastName: savedEnrollment.studentLastName,
    };
  }

  async findAll(query: GetEnrollmentsQueryDto) {
    const {
      number = '1',
      size = '10',
      sort,
      search,
      enrollmentDate,
      universityId,
      departmentId,
      studentId,
    } = query;

    const page = Number.parseInt(number, 10);
    const limit = Number.parseInt(size, 10);
    const skip = (page - 1) * limit;

    const queryBuilder = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.university', 'university')
      .leftJoinAndSelect('enrollment.department', 'department')
      .leftJoinAndSelect('enrollment.student', 'student');

    if (search) {
      queryBuilder.andWhere(
        `(
          university.name ILIKE :search
          OR department.name ILIKE :search
          OR student.firstName ILIKE :search
          OR student.lastName ILIKE :search
        )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (enrollmentDate) {
      queryBuilder.andWhere('enrollment.enrollmentDate = :enrollmentDate', {
        enrollmentDate,
      });
    }

    if (universityId) {
      queryBuilder.andWhere('university.id = :universityId', {
        universityId: Number(universityId),
      });
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', {
        departmentId: Number(departmentId),
      });
    }

    if (studentId) {
      queryBuilder.andWhere('student.id = :studentId', {
        studentId: Number(studentId),
      });
    }

    if (sort) {
      const [field, order] = sort.split(',');

      const allowedSortFields = [
        'id',
        'enrollmentDate',
        'universityName',
        'departmentName',
        'studentFirstName',
        'studentLastName',
      ];

      if (allowedSortFields.includes(field)) {
        let sortField = `enrollment.${field}`;

        if (field === 'universityName') {
          sortField = 'university.name';
        } else if (field === 'departmentName') {
          sortField = 'department.name';
        } else if (field === 'studentFirstName') {
          sortField = 'student.firstName';
        } else if (field === 'studentLastName') {
          sortField = 'student.lastName';
        }

        queryBuilder.orderBy(
          sortField,
          order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
      } else {
        queryBuilder.orderBy('enrollment.id', 'DESC');
      }
    } else {
      queryBuilder.orderBy('enrollment.id', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [enrollments, total] = await queryBuilder.getManyAndCount();

    const content = enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrollmentDate: enrollment.enrollmentDate,
      universityId: enrollment.university.id,
      universityName: enrollment.university.name,
      departmentId: enrollment.department.id,
      departmentName: enrollment.department.name,
      studentId: enrollment.student.id,
      studentFirstName: enrollment.student.firstName,
      studentLastName: enrollment.student.lastName,
    }));

    return {
      content,
      totalElements: total,
      page,
      size: limit,
    };
  }

  async findOne(id: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['university', 'department', 'student'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return {
      id: enrollment.id,
      enrollmentDate: enrollment.enrollmentDate,
      universityId: enrollment.universityId,
      universityName: enrollment.universityName,
      departmentId: enrollment.departmentId,
      departmentName: enrollment.departmentName,
      studentId: enrollment.studentId,
      studentFirstName: enrollment.studentFirstName,
      studentLastName: enrollment.studentLastName,
    };
  }

  find(enrollmentDate: string) {
    return this.enrollmentRepository.find({
      where: {
        enrollmentDate,
      },
      relations: ['university', 'department', 'student'],
    });
  }

  async update(id: string, attributes: Partial<CreateEnrollmentDto>) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['university', 'department', 'student'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const {
      universityId,
      departmentId,
      studentId,
      ...enrollmentData
    } = attributes;

    Object.assign(enrollment, enrollmentData);

    if (universityId !== undefined) {
      const university = await this.universityRepository.findOneBy({
        id: universityId,
      });

      if (!university) {
        throw new NotFoundException('University not found');
      }

      enrollment.university = university;
    }

    if (departmentId !== undefined) {
      const department = await this.departmentRepository.findOneBy({
        id: departmentId,
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      enrollment.department = department;
    }

    if (studentId !== undefined) {
      const student = await this.studentRepository.findOneBy({
        id: studentId,
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      enrollment.student = student;
    }

    const updatedEnrollment = await this.enrollmentRepository.save(enrollment);

    return {
      id: updatedEnrollment.id,
      enrollmentDate: updatedEnrollment.enrollmentDate,
      universityId: updatedEnrollment.universityId,
      universityName: updatedEnrollment.universityName,
      departmentId: updatedEnrollment.departmentId,
      departmentName: updatedEnrollment.departmentName,
      studentId: updatedEnrollment.studentId,
      studentFirstName: updatedEnrollment.studentFirstName,
      studentLastName: updatedEnrollment.studentLastName,
    };
  }

  async remove(id: string) {
    const enrollment = await this.enrollmentRepository.findOneBy({
      id: Number(id),
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return this.enrollmentRepository.remove(enrollment);
  }

  async findAllForExport(query: GetEnrollmentsQueryDto) {
    const {
      sort,
      search,
      enrollmentDate,
      universityId,
      departmentId,
      studentId,
    } = query;

    const queryBuilder = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.university', 'university')
      .leftJoinAndSelect('enrollment.department', 'department')
      .leftJoinAndSelect('enrollment.student', 'student');

    if (search) {
      queryBuilder.andWhere(
        `(
          university.name ILIKE :search
          OR department.name ILIKE :search
          OR student.firstName ILIKE :search
          OR student.lastName ILIKE :search
        )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (enrollmentDate) {
      queryBuilder.andWhere('enrollment.enrollmentDate = :enrollmentDate', {
        enrollmentDate,
      });
    }

    if (universityId) {
      queryBuilder.andWhere('university.id = :universityId', {
        universityId: Number(universityId),
      });
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', {
        departmentId: Number(departmentId),
      });
    }

    if (studentId) {
      queryBuilder.andWhere('student.id = :studentId', {
        studentId: Number(studentId),
      });
    }

    if (sort) {
      const [field, order] = sort.split(',');

      const allowedSortFields = [
        'id',
        'enrollmentDate',
        'universityName',
        'departmentName',
        'studentFirstName',
        'studentLastName',
      ];

      if (allowedSortFields.includes(field)) {
        let sortField = `enrollment.${field}`;

        if (field === 'universityName') {
          sortField = 'university.name';
        } else if (field === 'departmentName') {
          sortField = 'department.name';
        } else if (field === 'studentFirstName') {
          sortField = 'student.firstName';
        } else if (field === 'studentLastName') {
          sortField = 'student.lastName';
        }

        queryBuilder.orderBy(
          sortField,
          order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
      } else {
        queryBuilder.orderBy('enrollment.id', 'DESC');
      }
    } else {
      queryBuilder.orderBy('enrollment.id', 'ASC');
    }

    const enrollments = await queryBuilder.getMany();

    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrollmentDate: enrollment.enrollmentDate,
      universityId: enrollment.university.id,
      universityName: enrollment.university.name,
      departmentId: enrollment.department.id,
      departmentName: enrollment.department.name,
      studentId: enrollment.student.id,
      studentFirstName: enrollment.student.firstName,
      studentLastName: enrollment.student.lastName,
    }));
  }

  async batchEnrollByDepartment(body: BatchEnrollmentDto) {
    const { departmentId, enrollmentDate } = body;

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      relations: {
        university: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const students = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .getMany();

    const totalStudents = students.length;

    const activeStudents = students.filter((student) => student.active);

    const inactiveStudents = totalStudents - activeStudents.length;

    if (activeStudents.length === 0) {
      return {
        departmentId: department.id,
        departmentName: department.name,
        universityId: department.university.id,
        universityName: department.university.name,
        totalStudents,
        activeStudents: 0,
        inactiveStudents,
        alreadyEnrolled: 0,
        successfullyEnrolled: 0,
        failed: 0,
      };
    }

    const studentIds = activeStudents.map((student) => student.id);

    const existingEnrollments = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoin('enrollment.department', 'department')
      .leftJoin('enrollment.university', 'university')
      .where('student.id IN (:...studentIds)', { studentIds })
      .andWhere('department.id = :departmentId', { departmentId })
      .andWhere('university.id = :universityId', {
        universityId: department.university.id,
      })
      .getMany();

    const enrolledStudentIds = new Set(
      existingEnrollments.map((enrollment) => enrollment.student.id),
    );

    const eligibleStudents = activeStudents.filter(
      (student) => !enrolledStudentIds.has(student.id),
    );

    const enrollments = eligibleStudents.map((student) =>
      this.enrollmentRepository.create({
        enrollmentDate,
        student,
        department,
        university: department.university,
      }),
    );

    if (enrollments.length > 0) {
      await this.enrollmentRepository.save(enrollments);
    }

    return {
      departmentId: department.id,
      departmentName: department.name,
      universityId: department.university.id,
      universityName: department.university.name,
      totalStudents,
      activeStudents: activeStudents.length,
      inactiveStudents,
      alreadyEnrolled: enrolledStudentIds.size,
      successfullyEnrolled: enrollments.length,
      failed: 0,
    };
  }
}
