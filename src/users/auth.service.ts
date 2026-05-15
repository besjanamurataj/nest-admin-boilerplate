import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import * as bcrypt from 'bcrypt';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(body: any) {
    const { email, password } = body;

    const userExists = await this.usersService.find(email);
    if (userExists) {
      throw new BadRequestException('Email is in use');
    }
    const user = await this.usersService.create(body);

    return user;
  }
}
