import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsDate } from 'class-validator';
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
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Expose()
  @Column({ nullable: true })
  street?: string;

  @Exclude()
  @OneToOne(() => User, (user) => user.userInfo)
  user?: User;
}
