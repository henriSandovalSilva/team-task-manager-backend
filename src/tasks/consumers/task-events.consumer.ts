import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TaskGateway } from '../gateway/task.gateway';

@Injectable()
export class TaskEventsConsumer {
  constructor(private readonly gateway: TaskGateway) {}

  @RabbitSubscribe({
    exchange: 'task_exchange',
    routingKey: 'task.status.changed',
    queue: 'task-status-changed-queue'
  })
  handleStatusChange(payload: any) {
    console.log('Evento recebido via RabbitMQ:', payload);

    this.gateway.broadcastTaskStatusUpdate(payload);
  }
}
