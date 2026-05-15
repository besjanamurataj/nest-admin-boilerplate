import { Expose } from 'class-transformer';
import { User } from '../user.entity';
import { UserInfoDto } from 'src/userInfo/userInfo.dto';

export class UserDto {
  @Expose()
  id!: number;
  @Expose()
  email!: string;
  @Expose()
  name!: string;
  @Expose()
  surname!: string;
  @Expose()
  username!: string;
  @Expose()
  admin!: boolean;
  @Expose()
  roles!: number[];
  @Expose()
  userInfo!: UserInfoDto;
}
