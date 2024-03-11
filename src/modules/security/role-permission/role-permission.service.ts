import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { handleDatabaseErrorMessages } from 'src/common/utils/databaseErrorMessages';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class RolePermissionService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) { }

  async create(createRolePermissionDto: CreateRolePermissionDto[]) {
    await this.rolePermissionRepository.clear();
    const rolePermissions: RolePermission[] = [];

    for (const dto of createRolePermissionDto) {
      const { roleId, permissionsId } = dto;

      const role = await this.roleRepository.findOneBy({ id: roleId });
      if (!role) throw new NotFoundException(`Role with id ${roleId} not found`);

      const permissionsUnexists: number[] = [];
      for (const permissionId of permissionsId) {
        const verifyPermission = await this.verifyPermissionExists(permissionId);
        if (!verifyPermission) permissionsUnexists.push(permissionId);
      }
      if (permissionsUnexists.length > 0) throw new NotFoundException(`Permissions with id ${permissionsUnexists} do not exist`);

      const rolePermission = await this.createRolePermissions(role, permissionsId);
      rolePermissions.push(...rolePermission);
    }

    try {
      await this.rolePermissionRepository.save(rolePermissions);
    } catch (error) {
      handleDatabaseErrorMessages(error)
    }

    const rolePermissionsAll = await this.rolePermissionRepository.find({ relations: ['role', 'permission'] });
    return rolePermissionsAll.map(rolePermission => ({
      id: rolePermission.id,
      roleId: rolePermission.role.id,
      role: rolePermission.role.name,
      permissionId: rolePermission.permission.id,
      permission: rolePermission.permission.name,
    }));
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const rolePermissions = await this.rolePermissionRepository.find({ take: limit, skip: offset, relations: ['role', 'permission'] });
    return rolePermissions.map(rolePermission => ({
      id: rolePermission.id,
      roleId: rolePermission.role.id,
      role: rolePermission.role.name,
      permissionId: rolePermission.permission.id,
      permission: rolePermission.permission.name,
    }));
  }

  async getPermissionsByRoleId(roleId: number) {
    const permissions = await this.rolePermissionRepository.find({ where: { role: { id: roleId } }, relations: ['role', 'permission'] });
    const role = await this.roleRepository.findOneBy({ id: roleId });
    const permissionsByRoleId = {
      roleId: roleId,
      role: role.name,
      permissions: permissions.map(permission => ({
        permissionId: permission.permission.id,
        permissionName: permission.permission.name,
      })),
    };
    return permissionsByRoleId;
  }

  async getRolesByPermissionId(permissionId: number) {
    const roles = await this.rolePermissionRepository.find({ where: { permission: { id: permissionId } }, relations: ['role', 'permission'] });
    const permission = await this.permissionRepository.findOneBy({ id: permissionId });
    const rolesByPermissionId = {
      permissionId: permissionId,
      permission: permission.name,
      roles: roles.map(role => ({
        roleId: role.role.id,
        roleName: role.role.name,
      })),
    };
    return rolesByPermissionId;
  }

  private async verifyPermissionExists(permissionId: number) {
    const permission = await this.permissionRepository.findOneBy({ id: permissionId });
    if (!permission) return false
    return true
  }

  private async createRolePermissions(role: Role, permissions: number[]) {
    const permissionsInDb = await this.permissionRepository.find({ where: { id: In(permissions) } });
    const rolePermissions = permissionsInDb.map(permission => {
      const rolePermission = new RolePermission();
      rolePermission.role = role;
      rolePermission.permission = permission;
      return rolePermission;
    });

    return rolePermissions;
  }
}
