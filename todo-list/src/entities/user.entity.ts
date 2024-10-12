import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    surname: string;

    @Column({ unique: true })
    login: string;

    @Column()
    password: string;

    @ManyToOne(() => User, (user) => user.subordinates)
    manager: User;

    @OneToMany(() => User, (user) => user.manager)
    subordinates: User[];

    @OneToMany(() => Task, (task) => task.creator)
    createdTasks: Task[];

    @ManyToMany(() => Task, (task) => task.responsibles)
    assignedTasks: Task[];
}
