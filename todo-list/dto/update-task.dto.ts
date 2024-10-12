import { IsOptional, IsString, IsDate, IsArray, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Название задачи', description: 'Название задачи', type: String })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Описание задачи', description: 'Описание задачи', type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '31-12-2024', description: 'Дата завершения задачи', type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: 'Высокий', description: 'Приоритет задачи', type: String })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Выполняется', description: 'Статус задачи', type: String })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: [1, 2], description: 'ID ответсвенных за задачу пользователей', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  responsibleIds?: number[];
}
