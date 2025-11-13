import { Module, forwardRef } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '@common/prisma/prisma.service';
import { PortfoliosModule } from '../investments/portfolios/portfolios.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
  imports: [forwardRef(() => PortfoliosModule)]
})
export class TransactionsModule {}
