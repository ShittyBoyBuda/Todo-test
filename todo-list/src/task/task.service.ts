import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDto } from 'dto/create-task.dto';
import { UpdateTaskDto } from 'dto/update-task.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = this.taskRepository.create({
            ...createTaskDto,
            creator: user,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (createTaskDto.responsibleIds) {
            const responsibleUsers = await this.userRepository.findByIds(createTaskDto.responsibleIds);
            task.responsibles = responsibleUsers;
        }

        return this.taskRepository.save(task);
    }

    async updatedTask(taskId: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['creator', 'responsibles'] });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        const isCreator = task.creator.id === user.id;
        const isResponsible = task.responsibles.some(responsible => responsible.id === user.id);
        const managerId = user.manager?.id;
        const subordinates = await this.userRepository.find({ where: { manager: user } });

        if (!isCreator && !isResponsible) {
            throw new ForbiddenException('You do not have permission to update this task');
        }

        if (isResponsible) {
            if (updateTaskDto.status !== undefined) {
                task.status = updateTaskDto.status; 
            } else {
                throw new ForbiddenException('You can only update the status of this task');
            }
        }

        if (isCreator) {
            if (updateTaskDto.responsibleIds) {
                const newResponsibleUsers = await this.userRepository.findByIds(updateTaskDto.responsibleIds);

                for (const newResponsibleUser of newResponsibleUsers) {
                    if (!subordinates.some(sub => sub.id === newResponsibleUser.id)) {
                        throw new ForbiddenException('You can only assign subordinates as responsible');
                    }
                }

                task.responsibles = newResponsibleUsers;
            }
            Object.assign(task, updateTaskDto);
        }

        task.updatedAt = new Date();

        return this.taskRepository.save(task);
    }

    async deleteTask(taskId: number, user: User): Promise<void> {
        const task = await this.taskRepository.findOne({ where: {id: taskId }, relations: ['creator'] });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        const isCreator = task.creator.id === user.id;

        if (!isCreator) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        await this.taskRepository.remove(task);
    }

    async findAll(): Promise<Task[]> {
        return this.taskRepository.find({ relations: ['creator', 'responsibles'] });
    }
}
