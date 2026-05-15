import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Type } from 'class-transformer';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from 'src/authority/authority.entity';
import { UserInfo } from 'src/userInfo/userInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Authority])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
