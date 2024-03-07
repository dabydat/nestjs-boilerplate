import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto[]) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto ) {
    return this.menuService.findAll(paginationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
