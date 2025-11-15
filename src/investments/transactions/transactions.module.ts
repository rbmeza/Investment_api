import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PortfoliosService } from '../../portfolios/portfolios.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PortfoliosService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
