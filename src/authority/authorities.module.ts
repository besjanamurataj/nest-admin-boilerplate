import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from 'src/authority/authority.entity';
import { AuthorityService } from './authorities.service';
import { AuthorityController } from './authorities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Authority])],
  controllers: [AuthorityController],
  providers: [AuthorityService],
})
export class AuthorityModule {}
