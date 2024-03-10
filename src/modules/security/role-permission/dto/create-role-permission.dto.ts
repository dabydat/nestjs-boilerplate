import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolePermissionDto {
    @ApiProperty({ description: 'The id of the role.' })
    @IsNotEmpty()
    roleId: number;

    @ApiProperty({ description: 'The id of the permissions to asign to the role.' })
    @IsNotEmpty()
    permissionsId: number[];
}
