import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";
import { Menu } from "../entities/menu.entity";

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    isParent: boolean;

    @IsString()
    @IsOptional()
    parentId: number;

    @IsString()
    @IsOptional()
    toLink: string;

    @IsNumber()
    @IsNotEmpty()
    order: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsOptional()
    parent: Menu;

    @IsOptional()
    children: Menu[];
}
