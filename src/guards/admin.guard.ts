import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

interface AuthenticatedRequest {
  currentUser?: {
    admin: boolean;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.currentUser?.admin === true;
  }
}
