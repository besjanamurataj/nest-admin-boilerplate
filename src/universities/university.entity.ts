import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity()
export class University {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column()
  name!: string;

  @Expose()
  @Column({ unique: true })
  code!: string;

  @Expose()
  @Column()
  city!: string;

  @Expose()
  @Column()
  email!: string;
}
