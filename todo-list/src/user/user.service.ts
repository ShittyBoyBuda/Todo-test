import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'dto/create-user.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async registerUser(userData: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        if (userData.managerId) {
            const manager = await this.userRepository.findOne({ where: { id: userData.managerId } });
            if (manager) {
                newUser.manager = manager;
            }
        }

        await this.userRepository.save(newUser);
        return newUser;
    }

    async findByLogin(login: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { login } });
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } })
    }

    async getSubordinates(managerId: number): Promise<User[]> {
        const manager = await this.userRepository.findOne({
            where: { id: managerId },
            relations: ['subordinates'],
        });
        return manager ? manager.subordinates : [];
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }
    
}
