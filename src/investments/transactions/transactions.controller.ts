import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('investments/transactions')
@UseGuards(AuthGuard('jwt')) 
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('history')
  getHistory(
    @GetUser('id') userId: number,
  ) {
    return this.transactionsService.getHistory(userId);
  }

  /**
   * Requisito: Registrar una orden de Compra o Venta (POST /transactions)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(
    @GetUser('userId') userId: number,
    @Body(ValidationPipe) registerTransactionDto: RegisterTransactionDto,
  ) {

    return this.transactionsService.register(userId, registerTransactionDto);
  }
}