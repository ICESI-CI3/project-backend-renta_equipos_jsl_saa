import { IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class UserDTO {

    @IsString()
    readonly name: string;

    @IsString()
    @Matches(/^[\w]+@[\w]\.[\w]/, {
        message: 'Correo electrónico inválido',
    })
    readonly email: string;

    @IsString()
    @MinLength(8, 
        { message: 'La contraseña es muy corta. Mínimo 8 caracteres de largo' }
    )
    @MaxLength(20, 
        { message: 'La contraseña es muy larga. Máximo 20 caracteres de largo' }
    )
    @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, 
        { message: 'La contraseña debe tener al menos una letra mayúscula y un número' }
    )
    password: string;

    @IsString()
    @Length(10, 10, { message: 'El número de celular debe tener 10 dígitos' })
    readonly cellphone: string;

    @IsString()
    readonly address: string;

}