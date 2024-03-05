import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { databaseErrors } from "src/common/utils/databaseErrorMessages";
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
      throw new BadRequestException({ ...databaseErrors[error.code], message: error.detail ? error.detail : error.message });
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Role[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const roles: Role[] = await this.roleRepository.find({ take: limit, skip: offset });
    return roles;
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }
k
  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
