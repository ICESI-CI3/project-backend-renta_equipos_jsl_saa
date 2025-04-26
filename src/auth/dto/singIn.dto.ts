import { IsString, Matches } from "class-validator";

export class SignInDto {
    @IsString()
    @Matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, {
        message: 'Correo electrónico inválido',
    })
    email: string;
    
    @IsString()
    password: string;
}