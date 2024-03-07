import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDatabaseErrorMessages } from "src/common/utils/databaseErrorMessages";
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role: Role = this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Role[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const roles: Role[] = await this.roleRepository.find({ take: limit, skip: offset });
    return roles;
  }

  async findOne(id: number): Promise<Role> {
    const role: Role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role: Role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    try {
      const updatedRole = Object.assign(role, updateRoleDto);
      return this.roleRepository.save(updatedRole);
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  async remove(id: number): Promise<Object> {
    const role: Role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException({ message: `Role with id ${id} not found` });
    try {
      const updatedRole: Role = await this.roleRepository.save({ id, isActive: false });
      return { ...role, ...updatedRole };
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }
}
