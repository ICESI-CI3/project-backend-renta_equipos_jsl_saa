import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, MinLength, MaxLength, Matches, Length, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'La contraseña no puede tener más de 20 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'La contraseña debe tener al menos una letra mayúscula y un número'
  })
  password: string;

  @Field()
  @IsString()
  @Length(10, 10, { message: 'El número de celular debe tener 10 dígitos' })
  cellphone: string;

  @Field()
  @IsString()
  address: string;

  @Field({ defaultValue: 'user' })
  @IsOptional()
  @IsString()
  role?: string;
}
