import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('authenticate')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.authenticate(loginDto.email, loginDto.password);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getUserInfo(@Request() req) {
    return req.user;
  }
}
