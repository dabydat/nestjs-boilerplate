import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { BaseEntity } from 'src/common/config/base.entity';

@Entity({ schema: 'security' })
export class Permission extends BaseEntity {
    @ApiProperty({ description: 'The name of the permission.' })
    @Column()
    name: string;

    @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
    rolePermissions: RolePermission[];
}
