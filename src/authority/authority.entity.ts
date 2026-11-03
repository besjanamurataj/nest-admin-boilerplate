import { Role } from 'src/roles/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Authority {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @ManyToMany(() => Role, (role) => role.authorities, { onDelete: 'CASCADE' })
  role!: Role[];
}
