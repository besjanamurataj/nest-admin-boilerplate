import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { University } from 'src/universities/university.entity';
import { Department } from './department.entity';
import { DepartmentService } from './departments.service';

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        { provide: getRepositoryToken(Department), useValue: {} },
        { provide: getRepositoryToken(University), useValue: {} },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
