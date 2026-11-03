import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from 'src/authority/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Authority])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
