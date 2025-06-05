import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'El número de celular debe tener 10 dígitos' })
  cellphone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;
}
