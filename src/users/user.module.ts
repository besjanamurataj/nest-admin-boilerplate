import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { Role } from 'src/roles/role.entity';
import { UserInfo } from 'src/userInfo/userInfo.entity';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserInfo]),BatchModule],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
