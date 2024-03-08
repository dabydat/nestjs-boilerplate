import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Menu } from './entities/menu.entity';
import { createMenuApiBody } from 'src/services/swagger-documentation/menu/create-menu';

@ApiTags('menus')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @createMenuApiBody
  @ApiResponse({ status: 201, description: 'The menu has been successfully created.', type: () => Menu })
  create(@Body() createMenuDto: CreateMenuDto[]) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all menus' })
  @ApiResponse({ status: 200, description: 'List of menus.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.menuService.findAll(paginationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a menu' })
  @ApiResponse({ status: 200, description: 'The menu has been successfully deactivated.' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
