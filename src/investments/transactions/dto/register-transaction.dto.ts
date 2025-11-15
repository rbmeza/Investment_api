import { IsString, IsInt, IsNumber, IsIn, IsISO8601 } from 'class-validator';

export class RegisterTransactionDto {
  @IsString()
  stockSymbol: string;

  @IsIn(['BUY', 'SELL'])
  type: 'BUY' | 'SELL';

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;

  @IsISO8601()
  date: string; 

  userId?: number;
}