import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { University } from 'src/universities/university.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

interface DepartmentQuery {
  number?: string;
  size?: string;
  sort?: string;
  search?: string;
}

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

  async create(body: CreateDepartmentDto) {
    const { universityId, ...departmentData } = body;

    const university = await this.universityRepository.findOneBy({
      id: universityId,
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    const department = this.departmentRepository.create({
      ...departmentData,
      university,
    });

    const savedDepartment = await this.departmentRepository.save(department);

    return {
      id: savedDepartment.id,
      name: savedDepartment.name,
      code: savedDepartment.code,
      description: savedDepartment.description,
      universityId: university.id,
      universityName: university.name,
    };
  }

  async findAll(query: DepartmentQuery) {
    const { number = '1', size = '5', sort, search } = query;

    const page = parseInt(number, 10);
    const limit = parseInt(size, 10);
    const skip = (page - 1) * limit;

    const queryBuilder = this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.university', 'university');

    if (search) {
      queryBuilder.where(
        `department.name ILIKE :search
        OR department.code ILIKE :search
        OR department.description ILIKE :search
        OR university.name ILIKE :search`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (sort) {
      const [field, order] = sort.split(',');

      const allowedSortFields = [
        'id',
        'name',
        'code',
        'description',
        'universityName',
      ];

      if (allowedSortFields.includes(field)) {
        const sortField =
          field === 'universityName'
            ? 'university.name'
            : `department.${field}`;

        queryBuilder.orderBy(
          sortField,
          order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
      } else {
        queryBuilder.orderBy('department.id', 'DESC');
      }
    } else {
      queryBuilder.orderBy('department.id', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [departments, total] = await queryBuilder.getManyAndCount();

    const content = departments.map((department) => ({
      id: department.id,
      name: department.name,
      code: department.code,
      description: department.description,
      universityId: department.university.id,
      universityName: department.university.name,
    }));

    return {
      content,
      totalElements: total,
      page,
      size: limit,
    };
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['university'],
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return {
      id: department.id,
      name: department.name,
      code: department.code,
      description: department.description,
      universityId: department.university.id,
      universityName: department.university.name,
    };
  }

  find(name: string) {
    return this.departmentRepository.find({
      where: {
        name,
      },
      relations: ['university'],
    });
  }

  async update(id: string, attributes: Partial<CreateDepartmentDto>) {
    const department = await this.departmentRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['university'],
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const { universityId, ...departmentData } = attributes;

    Object.assign(department, departmentData);

    if (universityId !== undefined) {
      const university = await this.universityRepository.findOneBy({
        id: universityId,
      });

      if (!university) {
        throw new NotFoundException('University not found');
      }

      department.university = university;
    }

    const updatedDepartment = await this.departmentRepository.save(department);

    return {
      id: updatedDepartment.id,
      name: updatedDepartment.name,
      code: updatedDepartment.code,
      description: updatedDepartment.description,
      universityId: updatedDepartment.university.id,
      universityName: updatedDepartment.university.name,
    };
  }

  async remove(id: string) {
    const department = await this.departmentRepository.findOneBy({
      id: Number(id),
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return await this.departmentRepository.remove(department);
  }
}
