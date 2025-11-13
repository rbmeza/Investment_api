import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6) // Mínimo 6 caracteres para la seguridad básica
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}