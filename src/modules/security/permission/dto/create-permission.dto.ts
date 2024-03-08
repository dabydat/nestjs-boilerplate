import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({ description: 'The name of the permission.' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Indicates whether the permission is active.', required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}