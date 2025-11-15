import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import Decimal from 'decimal.js';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Requisito: Edita el nombre del portafolio.
   */
  async update(userId: number, updatePortfolioDto: UpdatePortfolioDto) {
    try {
      const portfolio = await this.prisma.portfolio.update({
        where: { userId: userId },
        data: {
          name: updatePortfolioDto.name,
        },
        select: {
          id: true, name: true, stocksHeld: true
        }
      });
      return portfolio;
    } catch (error) {
      if (error.code === 'P2025') { 
        throw new NotFoundException(`Portafolio del usuario ${userId} no encontrado.`);
      }
      throw error;
    }
  }

  // **********************************************
  // 1. OBTENER ESTADO ACTUAL
  // **********************************************
  async getPortfolioState(userId: number) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portafolio no encontrado para el usuario ${userId}`);
    }

    return {
      ...portfolio,
      stocksHeld: (portfolio.stocksHeld as Record<string, number>) || {}, 
    };
  }
  
  // **********************************************
  // 2. APLICACIÓN DE TRANSACCIONES (MUTACIÓN ATÓMICA)
  // **********************************************
  async applyTransaction(
    userId: number, 
    type: 'BUY' | 'SELL', 
    symbol: string, 
    quantity: number, 
    price: number
  ) {
    const portfolio = await this.getPortfolioState(userId);
    const currentCash = new Decimal(portfolio.cash as any);
    const currentHoldings = portfolio.stocksHeld;
    
    // Cálculo de la cantidad total de dinero afectado
    const totalAmount = new Decimal(quantity).times(price);
    
    let newCash: Decimal;
    let newHoldings: Record<string, number>;

    if (type === 'BUY') {
      // VALIDACIÓN DE FONDOS
      if (currentCash.lessThan(totalAmount)) {
        throw new ConflictException(`Fondos insuficientes. Necesitas ${totalAmount} y tienes ${currentCash}.`);
      }
      
      // MUTACIÓN DE ESTADO (CASH y POSICIÓN)
      newCash = currentCash.minus(totalAmount);
      newHoldings = {
        ...currentHoldings,
        [symbol]: (currentHoldings[symbol] || 0) + quantity,
      };

    } else { // SELL
      // VALIDACIÓN DE TENENCIA
      const currentQuantity = currentHoldings[symbol] || 0;
      if (currentQuantity < quantity) {
        throw new ConflictException(`Stock insuficiente de ${symbol}. Tienes ${currentQuantity} y quieres vender ${quantity}.`);
      }
      
      // MUTACIÓN DE ESTADO (CASH y POSICIÓN)
      newCash = currentCash.plus(totalAmount);
      newHoldings = {
        ...currentHoldings,
        [symbol]: currentQuantity - quantity,
      };
    }
    
    // APLICAR CAMBIOS a la DB
    return this.prisma.portfolio.update({
      where: { userId },
      data: {
        cash: newCash,
        stocksHeld: newHoldings as any, // Guardamos el objeto actualizado como JSON
      },
      select: { cash: true, stocksHeld: true, userId: true, name: true }
    });
  }

  // **********************************************
  // 3. CONSULTA DE TOTAL (Muestra el estado)
  // **********************************************
  async calculateTotal(userId: number) {
    const state = await this.getPortfolioState(userId);
    const availableCash = new Decimal(state.cash as any);
    const stocksHeld = state.stocksHeld as Record<string, number>;

    // 1. OBTENER TODOS LOS PRECIOS DE LAS ACCIONES POSEÍDAS
    const symbols = Object.keys(stocksHeld).filter(symbol => stocksHeld[symbol] > 0);
    
    // Si no hay stocks, el valor es 0
    if (symbols.length === 0) {
      return {
        totalPortfolioValue: availableCash.toNumber(),
        availableCash: availableCash.toNumber(), 
        stocksHeld: state.stocksHeld,
        totalStockValue: 0,
        currency: 'CLP'
      };
    }
    
    // Consultar la base de datos por los precios de los símbolos que poseemos
    const marketPrices = await this.prisma.stock.findMany({
      where: { symbol: { in: symbols } },
      select: { symbol: true, price: true },
    });

    let totalStockValue = new Decimal(0);

    // 2. CALCULAR VALOR TOTAL DEL STOCK
    marketPrices.forEach(marketStock => {
      const quantity = stocksHeld[marketStock.symbol];
      if (quantity) {
        // Valor = Cantidad * Precio
        const stockPrice = new Decimal(marketStock.price as any);
        const stockValue = stockPrice.times(quantity);
        totalStockValue = totalStockValue.plus(stockValue);
      }
    });

    const finalTotalValue = availableCash.plus(totalStockValue);

    return {
      totalPortfolioValue: finalTotalValue.toNumber(),
      availableCash: availableCash.toNumber(), 
      stocksHeld: stocksHeld,
      totalStockValue: totalStockValue.toNumber(),
      currency: 'CLP'
    };
  }
}