import { Controller, Get, Post, Body, Param, Request, UseGuards, Put, Delete, UnauthorizedException, BadRequestException, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'dto/create-task.dto';
import { User } from 'src/entities/user.entity';
import { Task } from 'src/entities/task.entity';
import { UpdateTaskDto } from 'dto/update-task.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @ApiOperation({ summary: 'Создать новую задачу' })
    @ApiResponse({ status: 201, description: 'Задача успешно создана', type: Task })
    @ApiResponse({ status: 401, description: 'Пользователь не аутентифицирован' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req): Promise<Task> {
        const user: User = req.user;
        return this.taskService.createTask(createTaskDto, user);
    }

    @ApiOperation({ summary: 'Получить все задачи' })
    @ApiResponse({ status: 200, description: 'Список задач', type: [Task] })
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<Task[]> {
        return this.taskService.findAll();
    }

    @ApiOperation({ summary: 'Обновить задачу' })
    @ApiParam({ name: 'id', description: 'ID задачи', type: 'string' })
    @ApiResponse({ status: 200, description: 'Задача успешно обновлена', type: Task })
    @ApiResponse({ status: 400, description: 'Неверное id задачи' })
    @ApiResponse({ status: 401, description: 'Пользователь не аутентифицирован' })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req): Promise<Task> {
        const user: User = req.user;

        if (!user || !user.id) {
            throw new UnauthorizedException('Пользователь не аутентифицирован');
        }

        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            throw new BadRequestException('Неверное id задачи');
        }
        return this.taskService.updatedTask(taskId, updateTaskDto, user);
    }

    @ApiOperation({ summary: 'Удалить задачу' })
    @ApiParam({ name: 'id', description: 'ID задачи', type: 'string' })
    @ApiResponse({ status: 200, description: 'Задача успешно удалена' })
    @ApiResponse({ status: 400, description: 'Неверное id задачи' })
    @ApiResponse({ status: 401, description: 'Пользователь не аутентифицирован' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteTask(@Param('id') id: string, @Request() req): Promise<void> {
        const user: User = req.user;

        if (!user || !user.id) {
            throw new UnauthorizedException('Пользователь не аутентифицирован');
        }

        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            throw new BadRequestException('Неверное id задачи');
        }
        return this.taskService.deleteTask(taskId, user);
    }
}
