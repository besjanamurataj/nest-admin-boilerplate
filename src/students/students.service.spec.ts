import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Department } from 'src/departments/department.entity';
import { Student } from './student.entity';
import { StudentService } from './students.service';

describe('StudentsService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: getRepositoryToken(Student), useValue: {} },
        { provide: getRepositoryToken(Department), useValue: {} },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
