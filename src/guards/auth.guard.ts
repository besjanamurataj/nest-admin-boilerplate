import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/shared/decoratores/public.decorator';

interface AuthTokenPayload {
  id: string;
  sub: string;
}

interface AuthenticatedUser {
  userId: string;
  username: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      const tokenPayload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(token);

      request.user = {
        userId: tokenPayload.id,
        username: tokenPayload.sub,
      };

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
