import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: 'The name of the menu.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'A boolean to identify if a menu is a Parent Element.' })
  @IsNotEmpty()
  @IsBoolean()
  isParent: boolean;

  @ApiPropertyOptional({ description: 'The link of the menu.' })
  @IsOptional()
  @IsString()
  toLink?: string;

  @ApiProperty({ description: 'The order of the menu.' })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @ApiProperty({ description: 'A boolean to identify if a menu is active.' })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({ description: 'The child menus.', type: () => [CreateMenuDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuDto)
  children?: CreateMenuDto[];
}