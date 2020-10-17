import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskStatus } from './task-status.enum';
import { User } from "../auth/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Task extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column()
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User;

    //@ApiProperty()
    @Column()
    userId: number;
}