import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ivan123', description: 'Логин пользователя', type: String })
  login: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя', type: String })
  password: string;
}
