import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto[]) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.rolePermissionService.findAll(paginationDto);
  }

  @Get('permissions/:roleId')
  getPermissionsByRoleId(@Param('roleId') id: string) {
    return this.rolePermissionService.getPermissionsByRoleId(+id);
  }

  @Get('roles/:permissionId')
  findOne(@Param('permissionId') id: string) {
    return this.rolePermissionService.getRolesByPermissionId(+id);
  }
}
