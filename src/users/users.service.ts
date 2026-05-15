import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersQueryDto } from './dtos/get-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Role } from 'src/roles/role.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserInfo } from 'src/userInfo/userInfo.entity';

const scrypt = promisify(_scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async create(dto: CreateUserDto) {
    const { password, roles, userInfo, ...rest } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleEntities = roles?.length
      ? await this.roleRepository.find({ where: { id: In(roles) } })
      : [];

    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
      roles: roleEntities,
      userInfo: {
        phoneNumber: userInfo?.phoneNumber,
        gender: userInfo?.gender,
        birthDate: userInfo?.birthDate,
        street: userInfo?.street,
      },
    });

    return this.userRepository.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.authorities', 'userInfo'],
    });
  }

  find(email: string) {
    const test = this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.authorities', 'userInfo'],
    });
    return test;
  }

  findByName(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'userInfo'],
    });
  }

  async findAll(query: GetUsersQueryDto) {
    const { number = '1', size = '5', sort, name, surname, username } = query;

    const page = parseInt(number);
    const limit = parseInt(size);
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.userInfo', 'userInfo');

    if (query.search) {
      qb.where(
        'user.name ILIKE :search OR user.surname ILIKE :search OR user.username ILIKE :search',
        { search: `%${query.search}%` },
      );
    }

    if (name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if (surname) {
      qb.andWhere('user.surname ILIKE :surname', { surname: `%${surname}%` });
    }

    if (username) {
      qb.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (sort) {
      const [field, order] = sort.split(',');
      console.log(sort, field, order, 'field');
      qb.orderBy(
        `user.${field}`,
        (order?.toUpperCase() as 'ASC' | 'DESC') || 'ASC',
      );
    } else {
      qb.orderBy('user.id', 'DESC');
    }

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return plainToInstance(UserResponseDto, {
      content: data,
      totalElements: total,
      page,
      pageSize: limit,
    });
  }

  async update(id: number, attrs: Partial<UpdateUserDto>) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'userInfo'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { roles, userInfo, password, ...rest } = attrs;
    Object.assign(user, rest);
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (roles) {
      user.roles = await this.roleRepository.findBy({
        id: In(roles),
      });
    }

    if (userInfo) {
      if (!user.userInfo) {
        user.userInfo = new UserInfo();
      }
      Object.assign(user.userInfo, userInfo);
    }
    const updatedUser = await this.userRepository.save(user);
    console.log(updatedUser, 'updateuser');
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }
  async changePassword(id: number, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = hashed;

    return this.userRepository.save(user);
  }

 
}
