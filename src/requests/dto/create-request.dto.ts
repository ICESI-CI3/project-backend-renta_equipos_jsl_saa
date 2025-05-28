import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'IsStartBeforeFinish', async: false })
export class IsStartBeforeFinishConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    if (!obj.date_Start || !obj.date_Finish) return true;
    // Parse string dates and compare
    return new Date(obj.date_Start).getTime() < new Date(obj.date_Finish).getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return `La fecha de inicio (date_Start) debe ser anterior a la fecha de finalización (date_Finish).`;
  }
}

export class CreateRequestDto {

  @ApiProperty({
    description: 'Correo electrónico del usuario que realiza la solicitud',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  readonly user_email: string;

  @ApiProperty({
    description: 'Fecha de inicio de la solicitud (ISO 8601)',
    example: '2025-05-10T08:00:00Z',
  })
  @IsString()
  readonly date_Start: string;

  @ApiProperty({
    description: 'Fecha de finalización de la solicitud (ISO 8601)',
    example: '2025-05-15T18:00:00Z',
  })
  @IsString()
  readonly date_Finish: string;

  @Validate(IsStartBeforeFinishConstraint, {
    message: 'La fecha de inicio (date_Start) debe ser anterior a la fecha de finalización (date_Finish).'
  })
  validateDates: boolean; // campo auxiliar para invocar la validación personalizada

  @ApiProperty({
    description: 'Estado de la solicitud (pendiente, aprobada, rechazada)',
    example: 'pendiente',
    enum: ['pendiente', 'aprobada', 'rechazada'],
  })
  @IsString()
  @IsNotEmpty({ message: 'El estado no puede estar vacío' })
  readonly status: string;

  @ApiProperty({
    description: 'Comentario del administrador (opcional)',
    example: 'Solicitud validada y aprobada.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'El comentario no puede tener más de 500 caracteres',
  })
  readonly admin_comment?: string;

}