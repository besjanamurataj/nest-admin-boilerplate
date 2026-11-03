import { InjectRepository } from '@nestjs/typeorm';
import { Authority } from './authority.entity';
import { Repository } from 'typeorm';

export class AuthorityService {
  constructor(
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
  ) {}

  getAll() {
    return this.authorityRepository.find();
  }
}
