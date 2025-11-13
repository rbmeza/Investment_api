import { ConflictException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { TransactionType } from '@prisma/client';
import { PortfoliosService } from '../investments/portfolios/portfolios.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PortfoliosService))
    private portfoliosService: PortfoliosService
  ) {}

  /**
   * Registra una nueva transacción (Compra o Venta).
   */
  async register(userId: number, dto: RegisterTransactionDto) {
    const totalCost = dto.quantity * dto.price; // Costo total de la operación

    if (dto.type === 'BUY') {
      const availableCash = await this.portfoliosService.getAvailableCash(userId);

      if (availableCash < totalCost) {
        throw new ConflictException(
          `Fondos insuficientes. Necesitas ${totalCost}, pero solo tienes ${availableCash} disponible.`,
        );
      }
    }
    
    return this.prisma.transaction.create({
      data: {
        ...dto,
        type: dto.type as TransactionType,
        date: new Date(dto.date),
        userId: userId,
        price: dto.price, // Asume que ya resolviste el problema de tipado Decimal/Number
      },
      select: { id: true, stockSymbol: true, type: true, quantity: true, price: true, date: true },
    });
  }

  /**
   * Cálculo central: Determina el impacto neto de las transacciones en el efectivo.
   * COMPRA reduce el efectivo. VENTA aumenta el efectivo.
   */
  async calculateNetCashEffect(userId: number): Promise<number> {
    
    // 1. Sumar el costo total de TODAS las Compras
    const buys = await this.prisma.transaction.aggregate({
      where: { userId, type: TransactionType.BUY },
      _sum: { quantity: true, price: true }, // Notar que price y quantity no se pueden sumar directamente así en Prisma (es una limitación).
      // Alternativa: Se debe calcular en código después de obtener todas las transacciones, o en una consulta raw.
    });
    
    // Para simplificar y seguir con el flujo: Obtenemos todos los registros y calculamos el total en JS.
    const allTransactions = await this.prisma.transaction.findMany({
        where: { userId },
        select: { type: true, quantity: true, price: true }
    });
    
    let netCash = 0;
    
    for (const tx of allTransactions) {
        const totalAmount = tx.quantity * parseFloat(tx.price.toString());
        
        if (tx.type === 'SELL') {
            netCash += totalAmount; // El efectivo aumenta con las ventas
        } else { // BUY
            netCash -= totalAmount; // El efectivo disminuye con las compras
        }
    }

    return netCash; // Es el monto total que las transacciones han devuelto o restado al capital
  }
}