import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

interface CurrentUserType {
  userId: string;
  username: string;
}

interface AuthenticatedRequest extends Request {
  currentUser?: CurrentUserType;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): CurrentUserType | undefined => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.currentUser;
  },
);
