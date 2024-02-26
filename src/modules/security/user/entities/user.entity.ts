import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from "typeorm";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../../role/entities/role.entity";

@Entity({ schema: 'security' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @IsNotEmpty()
    @Column('text')
    name: string;

    @IsString()
    @IsNotEmpty()
    @Column('text')
    lastName: string;

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

    @ManyToOne(() => Role, role => role.users)
    role: Role;
}
