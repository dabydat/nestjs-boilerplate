import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MenuService {
  private menuLevelLimit: number;
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    private readonly configService: ConfigService,
  ) {
    this.menuLevelLimit = this.configService.get<number>('MENU_LEVEL_LIMIT');
  }

  async create(createMenuDto: CreateMenuDto[]) {
    for (const menu of createMenuDto) {
      const rootMenu = await this.createMenu(menu);
    }
    const relations = this.getMenuRelations(this.menuLevelLimit);
    const menus = await this.menuRepository.find({ take: 10, skip: 0, relations, order: { parentId: "ASC" } });
    const menusFiltered = menus.filter(menu => menu.parentId === null);
    return menusFiltered;
  }

  async findAll(paginationDto: PaginationDto): Promise<Menu[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const relations = this.getMenuRelations(this.menuLevelLimit);
    const menus = await this.menuRepository.find({ take: limit, skip: offset, relations, order: { parentId: "ASC" } });
    const menusFiltered = menus.filter(menu => menu.parentId === null);
    return menusFiltered;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }

  private getMenuRelations(level: number): string[] {
    const relations: string[] = ['children']; // Relación inicial
    for (let i = 1; i < level; i++) {
      relations.push(relations[relations.length - 1] + '.children'); // Agregar la relación recursiva
    }
    return relations;
  }

  public async createMenu(menuData: CreateMenuDto, parentMenuId: number | null = null): Promise<Menu> {
    console.log(menuData);
    
    const menu = this.menuRepository.create(menuData);
    if (parentMenuId) {
      const parentMenu = await this.menuRepository.findOne({ where: { id: parentMenuId } });
      if (parentMenu) {
        menu.parent = parentMenu;
      }
    }
    return this.menuRepository.save(menu);
  }
}
