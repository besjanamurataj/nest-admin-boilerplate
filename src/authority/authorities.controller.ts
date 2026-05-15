import { Controller, Get } from '@nestjs/common';
import { AuthorityService } from './authorities.service';

@Controller('authorities')
export class AuthorityController {
  constructor(private authorityService: AuthorityService) {}
  @Get()
  getAllAuthorities() {
    return this.authorityService.getAll();
  }
}
