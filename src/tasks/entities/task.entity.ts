import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Comment } from 'src/comments/entities/comment.entity';

export enum TaskPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
}

export enum TaskStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em progresso',
  DONE = 'Finalizado',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ManyToOne(() => User, user => user.tasks, { eager: true })
  responsible: User;

  @ManyToOne(() => Team, team => team.tasks, { onDelete: 'CASCADE' })
  team: Team;

  @OneToMany(() => Comment, comment => comment.task, { eager: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
