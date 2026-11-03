import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { UserInfo } from 'src/userInfo/userInfo.entity';
import { Repository } from 'typeorm';
import type { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class BatchService {
  constructor(
    @InjectQueue('birthday-emails')
    private readonly birthdayQueue: Queue,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async checkBirthdays() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const users = await this.userInfoRepository
      .createQueryBuilder('userInfo')
      .leftJoinAndSelect('userInfo.user', 'user')
      .where('EXTRACT(MONTH FROM "userInfo"."birthDate") = :month', { month })
      .andWhere('EXTRACT(DAY FROM "userInfo"."birthDate") = :day', { day })
      .getMany();

    for (const user of users) {
      console.log(
        'Happy birthday to :',
        user?.user?.name,
        'with email:',
        user?.user?.email,
      );
    }
  }
}
