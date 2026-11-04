import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UniversityService } from './universities.service';
import { University } from './university.entity';

describe('UniversityService', () => {
  let service: UniversityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityService,
        { provide: getRepositoryToken(University), useValue: {} },
      ],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
