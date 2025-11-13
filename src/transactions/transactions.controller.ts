// src/transactions/transactions.controller.ts
import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('transactions')
@UseGuards(AuthGuard('jwt')) 
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Requisito: Registrar una orden de Compra o Venta (POST /transactions)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(
    @GetUser('userId') userId: number,
    @Body() registerTransactionDto: RegisterTransactionDto,
  ) {

    return this.transactionsService.register(userId, registerTransactionDto);
  }
}