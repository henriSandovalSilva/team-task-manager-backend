import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/users/users.service';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private tasksService: TasksService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const user = await this.usersService.findOne(userId);
    const task = await this.tasksService.findOne(createCommentDto.taskId);

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      user,
      task,
    });

    return this.commentsRepository.save(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment || comment.user.id !== userId) {
      throw new ForbiddenException('Você não pode excluir esse comentário.');
    }

    await this.commentsRepository.remove(comment);
  }
}
