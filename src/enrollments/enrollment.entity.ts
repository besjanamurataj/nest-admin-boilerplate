import { Exclude, Expose } from 'class-transformer';
import { Department } from 'src/departments/department.entity';
import { Student } from 'src/students/student.entity';
import { University } from 'src/universities/university.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

@Exclude()
@Entity()
export class Enrollment {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column({
    type: 'date',
  })
  enrollmentDate!: string;

  @ManyToOne(() => University, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'university_id',
  })
  university!: University;

  @Expose()
  @RelationId((enrollment: Enrollment) => enrollment.university)
  universityId!: number;

  @Expose()
  get universityName(): string {
    return this.university?.name;
  }

  @ManyToOne(() => Department, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'department_id',
  })
  department!: Department;

  @Expose()
  @RelationId((enrollment: Enrollment) => enrollment.department)
  departmentId!: number;

  @Expose()
  get departmentName(): string {
    return this.department?.name;
  }

  @ManyToOne(() => Student, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'student_id',
  })
  student!: Student;

  @Expose()
  @RelationId((enrollment: Enrollment) => enrollment.student)
  studentId!: number;

  @Expose()
  get studentFirstName(): string {
    return this.student?.firstName;
  }

  @Expose()
  get studentLastName(): string {
    return this.student?.lastName;
  }
}
