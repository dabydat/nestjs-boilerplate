import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ schema: 'security' })
export class User {
    @ApiProperty({ description: 'The id of the user.' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'The name of the user.' })
    @Column('text')
    name: string;

    @ApiProperty({ description: 'The last name of the user.' })
    @Column('text')
    lastName: string;

    @ApiProperty({ description: 'The username of the user.' })
    @Column('text', { unique: true })
    username: string;

    @ApiProperty({ description: 'The email of the user.' })
    @Column('text', { unique: true })
    email: string;

    @ApiProperty({ description: 'The password of the user.' })
    @Column('text')
    password: string;

    @ApiProperty({ description: 'A boolean to identify if a user is active.' })
    @Column('boolean', { default: true })
    isActive: boolean;

    @ApiProperty({ description: 'The creation date of the user.' })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({ description: 'The update date of the user.' })
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty({ description: 'The deletion date of the user.' })
    @DeleteDateColumn({ type: 'timestamp', default: null })
    deletedAt: Date;

    @ApiProperty({ description: 'The role of the user.',  type: () => Role })
    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
