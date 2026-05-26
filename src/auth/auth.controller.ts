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
import { BatchService } from 'src/batch/batch.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private batchService: BatchService,
  ) {}

  @Post('authenticate')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.authenticate(loginDto.email, loginDto.password);
  }

  @Get('test-birthday')
  test() {
    console.log('test-birthday');
    return this.batchService.checkBirthdays();
  }
}
