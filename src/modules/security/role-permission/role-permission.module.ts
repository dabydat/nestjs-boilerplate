import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermission } from './entities/role-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  imports: [TypeOrmModule.forFeature([RolePermission])],
})
export class RolePermissionModule { }
