import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { UsersService } from '../users.service';
import { RequestWithCurrentUser } from '../user.entity';

export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<RequestWithCurrentUser>();
    const { userId } = request.session;
    if (userId !== undefined) {
      request.currentUser = await this.userService.findOne(userId);
    }
    return next.handle();
  }
}
