import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'security' })
export class RolePermission {
    @ApiProperty({ description: 'The unique identifier of the role-permission.' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'The role associated with the role-permission.' })
    @ManyToOne(() => Role, role => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ApiProperty({ description: 'The permission associated with the role-permission.' })
    @ManyToOne(() => Permission, permission => permission.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}