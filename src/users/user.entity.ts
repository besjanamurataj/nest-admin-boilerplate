import { Exclude, Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Role } from 'src/roles/role.entity';
import { UserInfo } from 'src/userInfo/userInfo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Exclude()
@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column({ nullable: true })
  name!: string;

  @Expose()
  @Column({ nullable: true })
  surname!: string;

  @Expose()
  @Column({ nullable: true })
  username!: string;

  @Expose()
  @Column()
  @IsEmail()
  email!: string;

  @Expose()
  @Column()
  password!: string;

  @Expose()
  @Column({ default: true })
  admin!: boolean;

  @Expose()
  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  @JoinTable()
  roles!: Role[];

  @Expose()
  @OneToOne(() => UserInfo, (userInfo) => userInfo.user, {
    cascade: true,
  })
  @JoinColumn()
  userInfo!: UserInfo;
}
