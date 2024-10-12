import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получить подчинённых пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: 'number' })
    @ApiResponse({ status: 200, description: 'Список подчинённых', type: [User] })
    @ApiResponse({ status: 401, description: 'Пользователь не аутентифицирован' })
    @UseGuards(JwtAuthGuard)
    @Get('subordinates/:id')
    async getSubordinates(@Param('id') id: number) {
        return this.userService.getSubordinates(id);
    }

    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, description: 'Список пользователей', type: [User] })
    @Get()
    async getUsers() {
        return this.userService.getAllUsers();
    }
}
