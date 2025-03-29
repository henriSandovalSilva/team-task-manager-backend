import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, TeamsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
