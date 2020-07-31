import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class UserDto {

    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @MinLength(6)
    readonly password: string;

    readonly balance: number;

    readonly currency: string;
}
