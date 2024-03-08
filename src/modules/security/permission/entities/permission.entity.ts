import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'security' })
export class Permission {
    @ApiProperty({ description: 'The unique identifier of the permission.' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'The name of the permission.' })
    @Column()
    name: string;

    @ApiProperty({ description: 'Indicates whether the permission is active.' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'The creation date of the permission.' })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({ description: 'The update date of the permission.' })
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty({ description: 'The deletion date of the permission.' })
    @DeleteDateColumn({ type: 'timestamp', default: null })
    deletedAt: Date;
}
