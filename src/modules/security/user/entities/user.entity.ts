import { Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/config/base.entity";

@Entity({ schema: 'security' })
export class User extends BaseEntity {
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

    @ApiProperty({ description: 'The role ID of the user.', type: 'number' })
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
