import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BatchService } from 'src/batch/batch.service';
import { User } from 'src/users/user.entity';
interface AuthenticationResult {
  user: User;
  accessToken: string;
}

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
