import { IsString, Matches } from "class-validator";

export class SignInDto {
    @IsString()
    @Matches(/^[\w]+@[\w]\.[\w]/, {
            message: 'Correo electrónico inválido',
        })
    email: string;
    
    @IsString()
    password: string;
}