import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { PortfoliosService } from '../../portfolios/portfolios.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private portfoliosService: PortfoliosService,
  ) {}

  async register(userId: number, dto: RegisterTransactionDto) {
    // 1. Aplicar la mutación de estado y las validaciones
    // El PortfoliosService Lanza ConflictException si no hay fondos/stock.
    const updatedPortfolio = await this.portfoliosService.applyTransaction(
      userId, 
      dto.type, 
      dto.stockSymbol, 
      dto.quantity, 
      dto.price
    );
    
    // 2. Crear el registro histórico (solo si la mutación fue exitosa)
    const transaction = await this.prisma.transaction.create({
      data: {
        ...dto,
        type: dto.type as TransactionType,
        date: new Date(dto.date),
        userId: userId,
      },
      select: { id: true, stockSymbol: true, type: true, quantity: true, price: true, date: true },
    });
    
    // Retornamos la transacción histórica y el nuevo estado del portafolio
    return {
        transaction,
        updatedPortfolioState: updatedPortfolio
    };
  }

  async getHistory(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { 
        date: 'desc'
      },
      select: {
        id: true,
        stockSymbol: true,
        type: true,
        quantity: true,
        price: true,
        date: true,
      }
    });
  }

}