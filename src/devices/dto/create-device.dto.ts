import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {

    @ApiProperty({
        description: 'Nombre del dispositivo',
        example: 'Laptop',
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'Descripción del dispositivo',
        example: 'Laptop Dell con pantalla de 15 pulgadas',
    })
    @IsString()
    readonly description: string;

    
    @ApiProperty({
        description: 'Tipo del dispositivo (Ej. móvil, laptop, etc.)',
        example: 'Laptop',
    })
    @IsString()
    readonly type: string;


    @ApiProperty({
        description: 'Estado del dispositivo (Ej. activo, inactivo)',
        example: 'activo',
    })
    @IsString()
    readonly status: string;

    @ApiProperty({
        description: 'Propietario del dispositivo',
        example: 'Empresa ABC',
    })
    @IsString()
    readonly owner: string;

    @ApiProperty({
        description: 'Imagen del dispositivo (URL de la imagen)',
        example: 'http://example.com/image.jpg',
    })
    @IsString()
    readonly image: string;
}
