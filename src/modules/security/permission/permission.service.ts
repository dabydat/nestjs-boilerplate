import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { handleDatabaseErrorMessages } from 'src/common/utils/databaseErrorMessages';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
  ) { }
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      const permission = this.permissionRepository.create(createPermissionDto);
      await this.permissionRepository.save(permission);
      return permission;
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Permission[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const permissions = await this.permissionRepository.find({ take: limit, skip: offset });
    return permissions;
  }

  async findOne(id: number): Promise<Permission> {
    const permission: Permission = await this.getPermissionById(id);
    if (!permission) throw new NotFoundException(`Permission with id ${id} not found`);
    return permission;
  }

  private async getPermissionById(id: number): Promise<Permission> {
    return await this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission: Permission = await this.getPermissionById(id);
    if (!permission) throw new NotFoundException(`User with id ${id} not found`);
    try {
      const permissionUpdated = Object.assign(permission, updatePermissionDto);
      return this.permissionRepository.save(permissionUpdated);
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  async remove(id: number): Promise<Permission> {
    const permission: Permission = await this.getPermissionById(id);
    if (!permission) throw new NotFoundException({ message: `Permission with id ${id} not found` });
    try {
      const permissionUpdated: Permission = await this.permissionRepository.save({ id, isActive: false });
      return { ...permission, ...permissionUpdated };
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }
}
