import { Module } from '@nestjs/common';
import { MovementsModule } from './movements/movements.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TransactionsModule, MovementsModule]
})
export class InvestmentsModule {}
