import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'dto/create-user.dto';
import { LoginDto } from 'dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
    @ApiResponse({ status: 409, description: 'Пользователь с таким логином уже существует' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const existingUser = await this.userService.findByLogin(createUserDto.login);

        if (existingUser) {
            throw new HttpException('Пользователь с таким логином уже существует', HttpStatus.CONFLICT);
        }

        const newUser = await this.userService.registerUser(createUserDto);
        return { message: 'Пользователь успешно зарегистрирован', user: newUser };
    }

    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiResponse({ status: 200, description: 'Успешный вход, возвращает JWT токен' })
    @ApiResponse({ status: 401, description: 'Неверные данные' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.login, loginDto.password);
        if (!user) {
            throw new HttpException('Неверные данные', HttpStatus.UNAUTHORIZED);
        }
        return this.authService.login(user);
    }
}
