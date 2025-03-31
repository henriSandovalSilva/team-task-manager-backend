import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.teams)
  users: User[];

  @OneToMany(() => Task, (task) => task.team)
  tasks: Task[];
}
