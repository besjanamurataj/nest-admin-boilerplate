import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { AuthUser, JwtPayload } from '../models/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.login(user);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.userService.find(email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return null;

    return {
      id: user.id,
      email: user.email,
      authorities: user.roles.flatMap((role) =>
        role.authorities.map((auth) => auth.name),
      ),
    };
  }

  async login(user: AuthUser): Promise<{ token: string }> {
    const payload: JwtPayload = {
      sub: user.email,
      authorities: user.authorities,
      id: user.id,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      token: access_token,
    };
  }
}
