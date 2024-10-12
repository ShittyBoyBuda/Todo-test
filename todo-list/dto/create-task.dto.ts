import { IsNotEmpty, IsString, IsDate, IsOptional, IsArray, IsInt } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty({ example: 'Название задачи', description: 'Название задачи', type: String})
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Описание задачи', description: 'Описание задачи', type: String})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '31-12-2024', description: 'Дата завершение задачи', type: String, format: 'date-time'})
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({ example: 'Высокий', description: 'Приоритет задачи', type: String})
    @IsString()
    @IsNotEmpty()
    priority: string;

    @ApiProperty({ example: 'Выполняется', description: 'Статус задачи', type: String})
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ example: [1, 2], description: 'ID ответсвенных за задачу пользователей', type: [Number]})
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    responsibleIds?: number[];
}
