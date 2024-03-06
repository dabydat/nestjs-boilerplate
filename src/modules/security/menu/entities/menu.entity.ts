import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'security' })
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: false })
    isParent: boolean;

    @Column({ nullable: true })
    parentId: number;

    @ManyToOne(() => Menu, menu => menu.children, { nullable: true })
    parent: Menu;

    @OneToMany(() => Menu, menu => menu.parent)
    children: Menu[];

    @Column({ nullable: true })
    toLink: string;

    @Column()
    order: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: null })
    deletedAt: Date;
}
