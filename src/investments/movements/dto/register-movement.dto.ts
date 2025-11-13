import { IsNumber, IsIn, IsISO8601 } from 'class-validator';

export class RegisterMovementDto {
  @IsIn(['DEPOSIT', 'WITHDRAWAL'])
  type: 'DEPOSIT' | 'WITHDRAWAL';

  @IsNumber()
  amount: number;

  @IsISO8601()
  // Usar un string en formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ) y luego transformarlo a Date en el servicio.
  date: string; 
}