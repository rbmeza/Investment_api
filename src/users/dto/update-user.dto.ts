import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'firstName no puede estar vacío' })
  @MaxLength(100, { message: 'firstName no puede exceder 100 caracteres' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'lastName no puede estar vacío' })
  @MaxLength(100, { message: 'lastName no puede exceder 100 caracteres' })
  lastName?: string;
}