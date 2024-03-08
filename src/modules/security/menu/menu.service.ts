import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { handleDatabaseErrorMessages } from "src/common/utils/databaseErrorMessages";

@Injectable()
export class MenuService {
  private menuLevelLimit: number;
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    private readonly configService: ConfigService,
  ) {
    this.menuLevelLimit = this.configService.get<number>('MENU_LEVEL_LIMIT');
  }

  async create(createMenuDto: CreateMenuDto[]): Promise<Menu[]> {
    await this.menuRepository.clear();
    const createdMenus: Menu[] = [];
    for (const menuDto of createMenuDto) {
      const createdMenu = await this.createMenu(menuDto);
      createdMenus.push(createdMenu);
    }
    return createdMenus;
  }

  async findAll(paginationDto: PaginationDto): Promise<Menu[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const relations = this.getMenuRelations(this.menuLevelLimit);
    const menus = await this.menuRepository.find({ take: limit, skip: offset, relations, order: { parentId: "ASC" } });
    const menusFiltered = menus.filter(menu => menu.parentId === null);
    return menusFiltered;
  }

  async remove(id: number) {
    const menu: Menu = await this.menuRepository.findOneBy({ id });
    if (!menu) throw new NotFoundException({ message: `Menu with id ${id} not found` });
    try {
      const updatedmenu: Menu = await this.menuRepository.save({ id, isActive: false });
      return { ...menu, ...updatedmenu };
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }

  private getMenuRelations(level: number): string[] {
    const relations: string[] = ['children']; // Relación inicial
    for (let i = 1; i < level; i++) {
      relations.push(relations[relations.length - 1] + '.children'); // Agregar la relación recursiva
    }
    return relations;
  }


  private async createMenu(createMenuDto: CreateMenuDto, parentMenu?: Menu): Promise<Menu> {
    try {
      const newMenu = this.menuRepository.create(createMenuDto);
      newMenu.parent = parentMenu;
      const savedMenu = await this.menuRepository.save(newMenu);

      if (createMenuDto.children) {
        for (const childMenuDto of createMenuDto.children) {
          await this.createMenu(childMenuDto, savedMenu);
        }
      }
      return savedMenu;
    } catch (error) {
      throw handleDatabaseErrorMessages(error);
    }
  }
}
