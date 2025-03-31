import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { TeamsService } from 'src/teams/teams.service';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly amqp: AmqpConnection,
    private usersService: UsersService,
    private teamsService: TeamsService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const responsible = await this.usersService.findOne(createTaskDto.responsibleId);
    const team = await this.teamsService.findOne(createTaskDto.teamId);

    const task = this.tasksRepository.create({
      ...createTaskDto,
      responsible,
      team,
    });

    return this.tasksRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['responsible', 'team'], 
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['responsible', 'team'],
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async findByTeamId(teamId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { team: { id: teamId } },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async addComment(taskId: string, content: string, userId: string) {
    const task = await this.tasksRepository.findOne({ where: { id: taskId }, relations: ['comments'] });
    const user = await this.usersRepository.findOneBy({ id: userId });

    const comment = this.commentsRepository.create({ content, task, user });

    return this.commentsRepository.save(comment);
  }
  
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    const oldStatus = task.status;

    if (updateTaskDto.responsibleId) {
      task.responsible = await this.usersService.findOne(updateTaskDto.responsibleId);
    }

    if (updateTaskDto.teamId) {
      task.team = await this.teamsService.findOne(updateTaskDto.teamId);
    }

    Object.assign(task, updateTaskDto);

    const updatedTask = await this.tasksRepository.save(task);

    if (oldStatus !== updatedTask.status) {
      this.amqp.publish('task_exchange', 'task.status.changed', {
        task: updatedTask,
        oldStatus
      });
    }
  
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
