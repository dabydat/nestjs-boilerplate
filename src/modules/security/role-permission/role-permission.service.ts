import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';

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

  async create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission[]> {
    const role = await this.roleRepository.findOneBy({ id: createRolePermissionDto.roleId });
    if (!role) throw new NotFoundException(`Role with id ${createRolePermissionDto.roleId} not found`);

    const permissions = await this.permissionRepository.find({ where: { id: In(createRolePermissionDto.permissionsId) } });

    const rolePermissions = permissions.map(permission => {
      const rolePermission = new RolePermission();
      rolePermission.role = role;
      rolePermission.permission = permission;
      return rolePermission;
    });

    return this.rolePermissionRepository.save(rolePermissions);
  }

  findAll() {
    return `This action returns all rolePermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolePermission`;
  }

  update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
    return `This action updates a #${id} rolePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolePermission`;
  }
}
