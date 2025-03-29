import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
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
    return this.tasksRepository.find({ relations: ['responsible', 'team'] });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['responsible', 'team'],
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.responsibleId) {
      task.responsible = await this.usersService.findOne(updateTaskDto.responsibleId);
    }

    if (updateTaskDto.teamId) {
      task.team = await this.teamsService.findOne(updateTaskDto.teamId);
    }

    Object.assign(task, updateTaskDto);

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
