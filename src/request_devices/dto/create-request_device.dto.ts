import { IsInt, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDeviceDto {

    @ApiProperty({
    description: 'ID de la solicitud a la que pertenece el dispositivo',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    })
    @IsString()
    readonly request_id: string;

    @ApiProperty({
    description: 'Nombre del dispositivo solicitado',
    example: 'Laptop Dell Latitude 5420',
    })
    @IsString()
    readonly device_name: string;
    
}