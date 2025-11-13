import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionsService: TransactionsService,
  ) {}

  /**
   * Requisito: Edita información del portafolio del usuario.
   */
  async update(userId: number, updatePortfolioDto: UpdatePortfolioDto) {
    try {
      const portfolio = await this.prisma.portfolio.update({
        where: { userId: userId },
        data: updatePortfolioDto,
      });
      return portfolio;
    } catch (error) {
      if (error.code === 'P2025') { 
        throw new NotFoundException(`Portafolio del usuario ${userId} no encontrado.`);
      }
      throw error;
    }
  }

  private async calculateCapitalFlow(userId: number): Promise<number> {
    const depositsSummary = await this.prisma.movement.aggregate({
      where: { userId, type: 'DEPOSIT' },
      _sum: { amount: true },
    });
    const withdrawalsSummary = await this.prisma.movement.aggregate({
      where: { userId, type: 'WITHDRAWAL' },
      _sum: { amount: true },
    });
    
    const totalDeposits = parseFloat(depositsSummary._sum.amount?.toString() || '0');
    const totalWithdrawals = parseFloat(withdrawalsSummary._sum.amount?.toString() || '0');
    
    return totalDeposits - totalWithdrawals; // Retorna el Capital Total Aportado
  }

  // **********************************************
  // ** FUNCIÓN CLAVE: MONTO DISPONIBLE **
  // **********************************************
  async getAvailableCash(userId: number): Promise<number> {
    // Capital Aportado (Depósitos - Retiros)
    const capitalAportado = await this.calculateCapitalFlow(userId);

    // Efectivo Neto de Transacciones (Ventas - Compras)
    const netCashEffect = await this.transactionsService.calculateNetCashEffect(userId); 
    
    // Monto Disponible = Capital Aportado + Efectivo Neto de Transacciones
    return capitalAportado + netCashEffect; 
  }
  
  // **********************************************
  // ** ACTUALIZACIÓN DE calculateTotal **
  // **********************************************
  async calculateTotal(userId: number) {
    // Monto disponible es el efectivo LIQUIDO
    const availableCash = await this.getAvailableCash(userId);
    
    // ... el resto del cálculo es el mismo, pero ahora usando 'availableCash' ...
    const stockValue = 0; // Valor de las acciones (a implementar luego)

    const totalPortfolio = availableCash + stockValue;

    return {
        totalPortfolioValue: totalPortfolio,
        availableCash: availableCash, // Este es el efectivo REAL
        totalStockValue: stockValue,
        currency: 'CLP'
    };
  }
}
