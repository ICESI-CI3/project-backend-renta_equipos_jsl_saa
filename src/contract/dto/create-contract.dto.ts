import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContractDto {
    @ApiProperty({
    description: 'ID único del contrato',
    example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    readonly id: string;

    @ApiProperty({
    description: 'Correo del usuario asociado al contrato',
    example: 'usuario@correo.com',
    })
    @IsString()
    readonly user_email: string;

    @ApiProperty({
    description: 'ID de la solicitud asociada',
    example: 'req-12345',
    })
    @IsString()
    readonly request_id: string;

    @ApiProperty({
    description: 'Fecha de inicio del contrato',
    example: '2025-05-01T00:00:00.000Z',
    })
    @IsString()
    readonly date_start: string;

    @ApiProperty({
    description: 'Fecha de finalización del contrato',
    example: '2025-12-31T00:00:00.000Z',
    })
    @IsString()
    readonly date_finish: string;

    @ApiProperty({
    description: 'Estado del contrato',
    example: 'Activo',
    })
    @IsString()
    readonly status: string;

    @ApiPropertyOptional({
    description: 'Firma del cliente (opcional)',
    example: 'Cliente XYZ',
    })
    @IsOptional()
    @IsString()
    readonly client_signature?: string;
}
