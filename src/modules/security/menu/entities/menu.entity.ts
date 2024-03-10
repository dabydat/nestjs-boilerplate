import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/config/base.entity";

@Entity({ schema: 'security' })
export class Menu extends BaseEntity {
    @ApiProperty({ description: 'The name of the menu.' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ description: 'A boolean to identify if a menu is a Parent Element.' })
    @Column({ default: false })
    isParent: boolean;

    @ApiProperty({ description: 'The id of the parent menu.' })
    @Column({ nullable: true })
    parentId: number;

    @ManyToOne(() => Menu, menu => menu.children, { nullable: true })
    parent: Menu;

    @ApiProperty({ description: 'The child menus.' })
    @OneToMany(() => Menu, menu => menu.parent)
    children: Menu[];

    @ApiProperty({ description: 'The link of the menu.' })
    @Column({ nullable: true })
    toLink: string;

    @ApiProperty({ description: 'The order of the menu.' })
    @Column()
    order: number;
}
