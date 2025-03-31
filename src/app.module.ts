import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { TaskGateway } from './tasks/gateway/task.gateway';
import { TaskEventsConsumer } from './tasks/consumers/task-events.consumer';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    RabbitMQModule.forRoot({
      exchanges: [
        { name: 'task_exchange', type: 'topic' }
      ],
      uri: process.env.RABBITMQ_URI,
    }),
    UsersModule,
    TeamsModule,
    TasksModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TaskGateway,
    TaskEventsConsumer
  ],
  exports: [RabbitMQModule]
})
export class AppModule {}
