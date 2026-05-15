import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity()
export class UserInfo {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column({ nullable: true })
  phoneNumber?: string;

  @Expose()
  @Column({ nullable: true })
  gender?: string;

  @Expose()
  @Column({ nullable: true })
  birthDate?: string;

  @Expose()
  @Column({ nullable: true })
  street?: string;

  @Exclude()
  @OneToOne(() => User, (user) => user.userInfo)
  user?: User;
}
