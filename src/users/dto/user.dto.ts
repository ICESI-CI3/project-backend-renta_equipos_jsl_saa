import { IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez',
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'Correo electrónico válido del usuario',
        example: 'juan.perez@example.com',
        pattern: '^[\\w.-]+@[\\w-]+\\.[a-zA-Z]{2,}$',
    })
    @IsString()
    @Matches(/^[\w.-]+@[\w-]+\.[a-zA-Z]{2,}$/, {
        message: 'Correo electrónico inválido',
    })
    readonly email: string;

    @ApiProperty({
        description: 'Contraseña que debe tener al menos una mayúscula y un número',
        minLength: 8,
        maxLength: 20,
        example: 'Segura123',
    })
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

    @ApiProperty({
        description: 'Número de celular con exactamente 10 dígitos',
        example: '3001234567',
        minLength: 10,
        maxLength: 10,
    })
    @IsString()
    @Length(10, 10, { message: 'El número de celular debe tener 10 dígitos' })
    readonly cellphone: string;

    @ApiProperty({
        description: 'Dirección del usuario',
        example: 'Calle 123 #45-67, Bogotá',
    })
    @IsString()
    readonly address: string;

}