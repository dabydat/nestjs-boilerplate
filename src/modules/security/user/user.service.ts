import * as bcrypt from "bcrypt";

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from './entities/user.entity';
import { handleDatabaseErrorMessages } from "src/common/utils/databaseErrorMessages";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create({ ...createUserDto, password: bcrypt.hashSync(createUserDto.password, 10) });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<{ [key: string]: any }[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({ take: limit, skip: offset, relations: ['role'], select: ["id", "name", "lastName", "username", "email", "role"] });
    const finalUsers = users.map(user => {
      return { ...user, role: user.role.name };
    });
    return finalUsers;
  }

  async findOne(id: number): Promise<any> {
    const user: User = await this.getUserById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { role, ...finalUser } = user;
    return { ...finalUser, role: role.name };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.getUserById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    try {
      const updatedUser = Object.assign(user, updateUserDto);
      return this.userRepository.save(updatedUser);
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  private async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id }, relations: ['role'], select: ["id", "name", "lastName", "username", "email", "role"] });
  }

  async remove(id: number): Promise<Object> {
    const user: User = await this.getUserById(id);
    if (!user) throw new NotFoundException({ message: `User with id ${id} not found` });
    try {
      const userUpdated: User = await this.userRepository.save({ id, isActive: false });
      return { ...user, ...userUpdated };
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }
}
