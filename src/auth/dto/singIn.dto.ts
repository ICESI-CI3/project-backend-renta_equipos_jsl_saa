import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsString()
  @Matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Correo electrónico inválido',
  })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña del usuario',
  })
  @IsString()
  password: string;
}
