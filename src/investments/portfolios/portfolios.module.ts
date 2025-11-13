import { Module, forwardRef } from '@nestjs/common';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { TransactionsModule } from '../../transactions/transactions.module';

@Module({
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
  imports: [forwardRef(() => TransactionsModule)],
  exports: [PortfoliosService]
})
export class PortfoliosModule {}
