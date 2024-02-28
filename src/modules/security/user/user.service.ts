import * as bcrypt from "bcrypt";

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';

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
      console.log(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({ take: limit, skip: offset });
    return users;
  }

  async findOne(id: number) {
    const getUser: User = await this.userRepository.findOne({ where: { id }, relations: ['role'], select: ["id", "name", "lastName", "username", "email", "role"] });
    const { role, ...user } = getUser;
    // const user: User = await this.userRepository.findOne({ 
    //   where: { id }, relations: ['role'], select: ["id", "name", "lastName", "username", "email", "role"]
    // });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return { ...user, role: role.name };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const userUpdated: User = await this.userRepository.save({ id, isActive: false }, { reload: true });
    return { ...userUpdated };
  }
}
