import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(body: any) {
    const { email } = body;

    const userExists = await this.usersService.find(email);
    if (userExists) {
      throw new BadRequestException('Email is in use');
    }
    const user = await this.usersService.create(body);

    return user;
  }
}
