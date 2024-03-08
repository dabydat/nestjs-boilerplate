import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "../../role/entities/role.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user.' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The last name of the user.' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: 'The username of the user.' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'The email of the user.' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The password of the user. It must have an uppercase, lowercase letter and a number.' })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({ description: 'The role of the user.', type: () => Role })
    @IsNotEmpty()
    role: Role;
}