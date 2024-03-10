import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RolePermission } from '../../role-permission/entities/role-permission.entity';
import { BaseEntity } from 'src/common/config/base.entity';

@Entity({ schema: 'security' })
export class Role extends BaseEntity {
  @ApiProperty({ description: 'The name of the role.' })
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
      this.name = this.name.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
      this.checkFieldsBeforeInsert();
  }
}