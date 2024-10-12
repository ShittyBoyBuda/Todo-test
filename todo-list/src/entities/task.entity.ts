import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    endDate: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    priority: string;

    @Column()
    status: string;

    @ManyToOne(() => User, (user) => user.createdTasks)
    creator: User;

    @ManyToMany(() => User, (user) => user.assignedTasks)
    @JoinTable()
    responsibles: User[];
}