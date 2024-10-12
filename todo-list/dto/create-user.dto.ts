import { IsString, IsNotEmpty, MinLength, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Иван', description: 'Имя пользователя', type: String})
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя', type: String})
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'Иванович', description: 'Отчество', type: String})
    @IsString()
    @IsNotEmpty()
    surname: string;

    @ApiProperty({ example: 'ivan123', description: 'Логин польщователя', type: String})
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty({ example: 'password123', description: 'Пароль пользователя (минимум 6 символов)', minLength: 6, type: String})
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({example: 1, description: 'ID руководителя пользователя', type: Number})
    @IsOptional()
    managerId?: number;
}