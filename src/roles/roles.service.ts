import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { Authority } from 'src/authority/authority.entity';

interface RoleQuery {
  number?: string;
  size?: string;
  sort?: string;
  search?: string;
}

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
  ) {}

  async create(body: CreateRoleDto) {
    const { authorities, ...roleData } = body;

    let authorityEntities: Authority[] = [];

    if (authorities?.length) {
      authorityEntities = await this.authorityRepository.find({
        where: {
          id: In(authorities),
          
        },
      });
    }

    const role = this.roleRepository.create({
      ...roleData,
      authorities: authorityEntities,
    });
    return await this.roleRepository.save(role);
  }

  async findAll(query: RoleQuery) {
    const { number = '1', size = '5', sort, search } = query;

    const page = Number.parseInt(number, 10);
    const limit = Number.parseInt(size, 10);
    const skip = (page - 1) * limit;

    const qb = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.authorities', 'authority');

    if (search) {
      qb.where('role.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sort) {
      const [field, order] = sort.split(',');

      const sortOrder: 'ASC' | 'DESC' =
        order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      qb.orderBy(`role.${field}`, sortOrder);
    } else {
      qb.orderBy('role.id', 'DESC');
    }

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return plainToInstance(UserResponseDto, {
      content: data,
      totalElements: total,
      page,
      size: limit,
    });
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.roleRepository.findOne({
      where: { id: Number(id) },
      relations: ['authorities'],
    });
  }

  find(name: string) {
    return this.roleRepository.findBy({ name });
  }

  async update(id: string, attrs: Partial<CreateRoleDto>) {
    const role = await this.roleRepository.findOne({
      where: { id: Number(id) },
      relations: ['authorities'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const { authorities, ...rest } = attrs;

    Object.assign(role, rest);
    if (authorities) {
      role.authorities = await this.authorityRepository.findBy({
        id: In(authorities),
      });
    }

    return this.roleRepository.save(role);
  }

  async remove(id: string) {
    const user = await this.roleRepository.findOneBy({ id: Number(id) });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.roleRepository.remove(user);
  }
}
