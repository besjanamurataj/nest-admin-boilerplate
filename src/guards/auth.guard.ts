import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const autherization = request.headers['authorization'];
    const token = autherization && autherization.split(' ')[1];

    if (!token) {
      new UnauthorizedException();
    }
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);

      request.user = {
        userId: tokenPayload.id,
        username: tokenPayload.sub,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
