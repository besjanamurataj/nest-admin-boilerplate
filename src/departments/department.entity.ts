import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { University } from 'src/universities/university.entity';

@Exclude()
@Entity()
export class Department {
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
  description!: string;

  @ManyToOne(() => University, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'university_id' })
  university!: University;

  @Expose()
  @RelationId((department: Department) => department.university)
  universityId!: number;

  @Expose()
  get universityName(): string {
    return this.university?.name;
  }
}
