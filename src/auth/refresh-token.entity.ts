import { Optional } from '@nestjs/common';
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, AfterLoad } from 'typeorm';


@Entity()
//@Unique(['username'])
export class RefreshToken extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    token: string;

    @Column()
    expires: Date;

    @Column()
    created: Date;

    @Column()
    createdByIp: string;

    @Column({ nullable: true })
    revoked: Date;

    @Column({ nullable: true })
    revokedByIp: string;

    @Column({ nullable: true })
    replacedByToken: string

    get isExpired(): boolean {
        return new Date() >= this.expires;
    }

    get isActive(): boolean {
        return !this.revoked && !this.isExpired;
    }

    // isExpired: boolean;
    // isActive: boolean;
    
    // @AfterLoad()
    // Expired(): void{
    //     this.isExpired = (new Date() >= this.expires);
    // }

    // @AfterLoad()
    // Active(): void {
    //     this.isActive = !this.revoked && !this.isExpired;
    // }
}