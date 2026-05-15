import { Expose } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UserResponseDto {
  @Expose()
  content!: CreateUserDto[];
  @Expose()
  totalElements!: number;
  @Expose()
  page!: number;
  @Expose()
  pageSize!: number;
}
