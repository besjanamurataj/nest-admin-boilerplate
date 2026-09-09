import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from './university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

  async create(body: CreateUniversityDto) {
    const university = this.universityRepository.create(body);

    return await this.universityRepository.save(university);
  }

  async findAll(query: any) {
    const { number = '1', size = '5', sort, search } = query;

    const page = parseInt(number, 10);
    const limit = parseInt(size, 10);
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.universityRepository.createQueryBuilder('university');

    if (search) {
      queryBuilder.where(
        `university.name ILIKE :search
        OR university.code ILIKE :search
        OR university.city ILIKE :search
        OR university.email ILIKE :search`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (sort) {
      const [field, order] = sort.split(',');

      queryBuilder.orderBy(
        `university.${field}`,
        order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    } else {
      queryBuilder.orderBy('university.id', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      content: data,
      totalElements: total,
      page,
      size: limit,
    };
  }

  async findOne(id: string) {
    const university = await this.universityRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  find(name: string) {
    return this.universityRepository.findBy({
      name,
    });
  }

  async update(id: string, attributes: Partial<CreateUniversityDto>) {
    const university = await this.universityRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    Object.assign(university, attributes);

    return await this.universityRepository.save(university);
  }

  async remove(id: string) {
    const university = await this.universityRepository.findOneBy({
      id: Number(id),
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return await this.universityRepository.remove(university);
  }
}
