import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Department } from 'src/departments/department.entity';

@Exclude()
@Entity()
export class Student {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column()
  firstName!: string;

  @Expose()
  @Column()
  lastName!: string;

  @Expose()
  @Column({ unique: true })
  email!: string;

  @Expose()
  @Column({
    type: 'date',
  })
  birthDate!: string;

  @Expose()
  @Column({
    type: 'boolean',
    default: true,
  })
  active!: boolean;

  @ManyToOne(() => Department, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'department_id',
  })
  department!: Department;

  @Expose()
  @RelationId((student: Student) => student.department)
  departmentId!: number;

  @Expose()
  get departmentName(): string {
    return this.department?.name;
  }
}
