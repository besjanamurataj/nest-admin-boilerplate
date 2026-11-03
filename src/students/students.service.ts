import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Department } from 'src/departments/department.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { GetStudentsQueryDto } from './dto/get-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(body: CreateStudentDto) {
    const { departmentId, ...studentData } = body;

    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const student = this.studentRepository.create({
      ...studentData,
      department,
    });

    const savedStudent = await this.studentRepository.save(student);

    return {
      id: savedStudent.id,
      firstName: savedStudent.firstName,
      lastName: savedStudent.lastName,
      email: savedStudent.email,
      birthDate: savedStudent.birthDate,
      active: savedStudent.active,
      departmentId: department.id,
      departmentName: department.name,
    };
  }

  async findAll(query: GetStudentsQueryDto) {
    const {
      number = '1',
      size = '5',
      sort,
      search,
      firstName,
      lastName,
      birthDate,
      active,
      departmentId,
    } = query;

    const page = Number.parseInt(number, 10);
    const limit = Number.parseInt(size, 10);
    const skip = (page - 1) * limit;

    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.department', 'department');

    if (search) {
      queryBuilder.andWhere(
        `(
        student.firstName ILIKE :search
        OR student.lastName ILIKE :search
        OR student.email ILIKE :search
        OR department.name ILIKE :search
      )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (firstName) {
      queryBuilder.andWhere('student.firstName ILIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      queryBuilder.andWhere('student.lastName ILIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    }

    if (birthDate) {
      queryBuilder.andWhere('student.birthDate = :birthDate', {
        birthDate,
      });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('student.active = :active', {
        active: active === 'true',
      });
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', {
        departmentId: Number(departmentId),
      });
    }

    if (sort) {
      const [field, order] = sort.split(',');

      const allowedSortFields = [
        'id',
        'firstName',
        'lastName',
        'email',
        'birthDate',
        'active',
        'departmentName',
      ];

      if (allowedSortFields.includes(field)) {
        const sortField =
          field === 'departmentName' ? 'department.name' : `student.${field}`;

        queryBuilder.orderBy(
          sortField,
          order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
      } else {
        queryBuilder.orderBy('student.id', 'DESC');
      }
    } else {
      queryBuilder.orderBy('student.id', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [students, total] = await queryBuilder.getManyAndCount();

    const content = students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      birthDate: student.birthDate,
      active: student.active,
      departmentId: student.department.id,
      departmentName: student.department.name,
    }));

    return {
      content,
      totalElements: total,
      page,
      size: limit,
    };
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      birthDate: student.birthDate,
      active: student.active,
      departmentId: student.department.id,
      departmentName: student.department.name,
    };
  }

  find(firstName: string) {
    return this.studentRepository.find({
      where: {
        firstName,
      },
      relations: ['department'],
    });
  }

  async update(id: string, attributes: Partial<CreateStudentDto>) {
    const student = await this.studentRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const { departmentId, ...studentData } = attributes;

    Object.assign(student, studentData);

    if (departmentId !== undefined) {
      const department = await this.departmentRepository.findOneBy({
        id: departmentId,
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      student.department = department;
    }

    const updatedStudent = await this.studentRepository.save(student);

    return {
      id: updatedStudent.id,
      firstName: updatedStudent.firstName,
      lastName: updatedStudent.lastName,
      email: updatedStudent.email,
      birthDate: updatedStudent.birthDate,
      active: updatedStudent.active,
      departmentId: updatedStudent.department.id,
      departmentName: updatedStudent.department.name,
    };
  }

  async remove(id: string) {
    const student = await this.studentRepository.findOneBy({
      id: Number(id),
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.studentRepository.remove(student);
  }

  async findAllForExport(query: GetStudentsQueryDto) {
    const {
      sort,
      search,
      firstName,
      lastName,
      birthDate,
      active,
      departmentId,
    } = query;

    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.department', 'department');

    if (search) {
      queryBuilder.andWhere(
        `(
        student.firstName ILIKE :search
        OR student.lastName ILIKE :search
        OR student.email ILIKE :search
        OR department.name ILIKE :search
      )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (firstName) {
      queryBuilder.andWhere('student.firstName ILIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      queryBuilder.andWhere('student.lastName ILIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    }

    if (birthDate) {
      queryBuilder.andWhere('student.birthDate = :birthDate', {
        birthDate,
      });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('student.active = :active', {
        active: active === 'true',
      });
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', {
        departmentId: Number(departmentId),
      });
    }

    if (sort) {
      const [field, order] = sort.split(',');

      const allowedSortFields = [
        'id',
        'firstName',
        'lastName',
        'email',
        'birthDate',
        'active',
        'departmentName',
      ];

      if (allowedSortFields.includes(field)) {
        const sortField =
          field === 'departmentName' ? 'department.name' : `student.${field}`;

        queryBuilder.orderBy(
          sortField,
          order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
      } else {
        queryBuilder.orderBy('student.id', 'DESC');
      }
    } else {
      queryBuilder.orderBy('student.id', 'DESC');
    }

    const students = await queryBuilder.getMany();

    return students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      birthDate: student.birthDate,
      active: student.active,
      departmentId: student.department.id,
      departmentName: student.department.name,
    }));
  }
}
