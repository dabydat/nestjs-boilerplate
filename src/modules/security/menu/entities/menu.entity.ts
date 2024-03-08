import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'security' })
export class Menu {

    @ApiProperty({ description: 'The id of the menu.' })
    @PrimaryGeneratedColumn()
    id: number;

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

    @ApiProperty({ description: 'A boolean to identify if a menu is active.' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'The creation date of the menu.' })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({ description: 'The update date of the menu.' })
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty({ description: 'The delete date of the menu.' })
    @DeleteDateColumn({ type: 'timestamp', default: null })
    deletedAt: Date;
}
