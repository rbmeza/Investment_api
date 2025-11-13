import { Controller, Patch, Body, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PortfoliosService } from './portfolios.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('investments/portfolio')
@UseGuards(AuthGuard('jwt')) 
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  /**
   * Requisito: Edita información del portafolio del usuario (PATCH /investments/portfolio)
   */
  @Patch()
  update(
    @GetUser('userId') userId: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfoliosService.update(userId, updatePortfolioDto);
  }

  /**
   * Requisito: Consultar el total de un portafolio de un usuario (GET /investments/portfolio/total)
   */
  @Get('total')
  calculateTotal(
    @GetUser('userId') userId: number,
  ) {
    return this.portfoliosService.calculateTotal(userId);
  }
}