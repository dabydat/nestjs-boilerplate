import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

@Entity({ schema: 'security' })
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @IsString()
    @IsNotEmpty()
    @Column('text')
    name: string;;

    @IsString()
    @IsNotEmpty()
    @Column('text')
    lastName: string;;

    @IsString()
    @IsNotEmpty()
    @Column('text')
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @Column('text')
    email: string;

    @IsString()
    @IsNotEmpty()
    @Column('text')
    password: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: null })
    deletedAt: Date;
}
