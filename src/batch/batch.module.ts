import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BullModule } from '@nestjs/bull';
import { UserInfo } from 'src/userInfo/userInfo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'birthday-emails',
    }),
    TypeOrmModule.forFeature([UserInfo]),
  ],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
