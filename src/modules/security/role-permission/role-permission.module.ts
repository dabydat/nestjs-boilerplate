import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermission } from './entities/role-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  imports: [TypeOrmModule.forFeature([RolePermission, Role, Permission])],
})
export class RolePermissionModule { }
