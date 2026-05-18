import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/shared/decoratores/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,  private reflector: Reflector,) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]

    )
    if(isPublic){
      return true 
    }
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
