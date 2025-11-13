import { IsString, IsInt, IsNumber, IsIn, IsISO8601 } from 'class-validator';

export class RegisterTransactionDto {
  @IsString()
  stockSymbol: string; // Ej: AAPL, GOOGL

  @IsIn(['BUY', 'SELL'])
  type: 'BUY' | 'SELL';

  @IsInt()
  quantity: number; // Debe ser un número entero de acciones

  @IsNumber()
  price: number; // Precio al que se ejecutó la orden

  @IsISO8601()
  date: string; 

  userId?: number;
}