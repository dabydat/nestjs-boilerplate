import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolePermissionDto {
    @ApiProperty({ description: 'The id of the role.' })
    @IsNotEmpty()
    roleId: number;

    @ApiProperty({ description: 'The id of the permission.' })
    @IsNotEmpty()
    permissionId: number;
}
