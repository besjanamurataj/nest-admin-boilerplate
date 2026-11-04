import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserInfo } from 'src/userInfo/userInfo.entity';
import { BatchService } from './batch.service';

describe('BatchService', () => {
  let service: BatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchService,
        { provide: getQueueToken('birthday-emails'), useValue: {} },
        { provide: getRepositoryToken(UserInfo), useValue: {} },
      ],
    }).compile();

    service = module.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
