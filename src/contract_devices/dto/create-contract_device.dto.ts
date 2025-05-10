import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDeviceDto {
    @ApiProperty({
    description: 'ID del contrato asociado al dispositivo',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsString()
    readonly contract_id: string;

    @ApiProperty({
    description: 'ID del dispositivo',
    example: '9f3a3f12-8fae-4b8d-9cb5-0f59a0e6fdee',
    })
    @IsString()
    readonly device_id: string;


    @ApiProperty({
        description: 'Nombre del dispositivo',
        example: 'iPad Pro 12.9"',
    })
    @IsString()
    readonly deviceName: string;

    @ApiProperty({
        description: 'Estado de entrega del dispositivo',
        example: 'Entregado',
    })
    @IsString()
    readonly delivey_status: string;

    
}