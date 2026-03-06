import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: number, taskData: Partial<Task>) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const task = this.taskRepo.create({
      ...taskData,
      user,
    });

    return this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find({
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateData: Partial<Task>) {
    await this.taskRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.taskRepo.delete(id);
  }
}
