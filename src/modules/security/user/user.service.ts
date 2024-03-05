import * as bcrypt from "bcrypt";

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';
import { databaseErrors } from "src/common/dtos/utils/databaseErrorMessages";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create({ ...createUserDto, password: bcrypt.hashSync(createUserDto.password, 10) });
      await this.userRepository.save(user);
      return { ...user };
    } catch (error) {
      throw new BadRequestException({ ...databaseErrors[error.code], message: error.detail });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({ take: limit, skip: offset });
    return users;
  }

  async findOne(id: number) {
    const user: User = await this.getUserById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { role, ...finalUser } = user;
    // const user: User = await this.userRepository.findOne({ where: { id }, relations: ['role'], select: ["id", "name", "lastName", "username", "email", "role"]});
    return { ...finalUser, role: role.name };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.getUserById(id);
    if (!user) { throw new NotFoundException(`User with id ${id} not found`); }
    try {
      const updatedUser = Object.assign(user, updateUserDto);
      return this.userRepository.save(updatedUser);
    } catch (error) {
      throw new BadRequestException({ ...databaseErrors[error.code], message: error.detail });
    }
  }

  private async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id }, relations: ['role'], select: ["id", "name", "lastName", "username", "email", "role"] });
  }

  async remove(id: number) {
    const user: User = await this.getUserById(id);
    if (!user) { throw new NotFoundException({ message: `User with id ${id} not found` }); }
    try {
      const userUpdated: User = await this.userRepository.save({ id, isActive: false });
      return { ...user, ...userUpdated };
    } catch (error) {
      throw new BadRequestException({ ...databaseErrors[error.code], message: error.detail });
    }
  }
}
