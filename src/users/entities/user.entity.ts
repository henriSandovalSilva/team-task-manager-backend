import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Team, team => team.users)
  @JoinTable()
  teams: Team[];

  @OneToMany(() => Task, task => task.responsible)
  tasks: Task[];
}
