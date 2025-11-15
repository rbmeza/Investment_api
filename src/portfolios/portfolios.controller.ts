import { Controller, Patch, Body, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PortfoliosService } from './portfolios.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateValidationPipe } from '../common/pipes/update-validation.pipe';

const PORTFOLIO_UPDATE_ALLOWED_FIELDS = ['name'];

@Controller('portfolio')
@UseGuards(AuthGuard('jwt')) 
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  /**
   * Requisito: Edita información del portafolio del usuario (PATCH /investments/portfolio)
   */
  @Patch()
  update(
    @GetUser('userId') userId: number,
    @Body(new UpdateValidationPipe(PORTFOLIO_UPDATE_ALLOWED_FIELDS)) 
    updatePortfolioDto: UpdatePortfolioDto
  ) {
    return this.portfoliosService.update(userId, updatePortfolioDto as unknown as Record<string, any>);
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