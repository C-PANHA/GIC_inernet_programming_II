import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  getTasks() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post('/')
  createTask(@Body() body: CreateTaskDto) {
    const { userId, ...taskData } = body;
    return this.taskService.create(userId, taskData);
  }

  @Patch('/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<CreateTaskDto> & { completedAt?: Date | null },
  ) {
    return this.taskService.update(id, body);
  }

  @Patch('/:id/done')
  markTaskAsDone(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.update(id, { completedAt: new Date() });
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.update(id, { completedAt: null });
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }
}
