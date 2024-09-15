import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password: string;

}