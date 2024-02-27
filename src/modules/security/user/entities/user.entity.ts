import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import * as bcrypt from "bcrypt";

@Entity({ schema: 'security' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    lastName: string;

    @Column('text', { unique: true })
    username: string;

    @Column('text', { unique: true })
    email: string;

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

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
        this.password = bcrypt.hashSync(this.password, 10);
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
