import { Exclude, Expose } from 'class-transformer';
import { Authority } from 'src/authority/authority.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Exclude()
@Entity()
export class Role {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;
  @Expose()
  @Column()
  name!: string;
  @Expose()
  @Column({ nullable: true })
  description?: string;
  @Exclude()
  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];
  @Expose()
  @ManyToMany(() => Authority, (authority) => authority.roles)
  @JoinTable()
  authorities!: Authority[];
}
