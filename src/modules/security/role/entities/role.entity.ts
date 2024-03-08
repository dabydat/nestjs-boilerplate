import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'security' })
export class Role {
  @ApiProperty({ description: 'The id of the role.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the role.' })
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @ApiProperty({ description: 'A boolean to identify if a role is active.' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'The creation date of the role.' })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'The update date of the role.' })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ description: 'The deletion date of the role.' })
  @DeleteDateColumn({ type: 'timestamp', default: null })
  deletedAt: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
      this.name = this.name.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
      this.checkFieldsBeforeInsert();
  }
}