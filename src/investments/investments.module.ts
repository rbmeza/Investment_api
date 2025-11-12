import { Module } from '@nestjs/common';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { MovementsModule } from './movements/movements.module';

@Module({
  imports: [PortfoliosModule, MovementsModule]
})
export class InvestmentsModule {}
