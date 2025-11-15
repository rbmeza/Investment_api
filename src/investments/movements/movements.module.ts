import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { PortfoliosService } from '../../portfolios/portfolios.service';

@Module({
  providers: [MovementsService, PortfoliosService],
  controllers: [MovementsController]
})
export class MovementsModule {}
