import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { RegisterMovementDto } from './dto/register-movement.dto';
import { PortfoliosService } from '../../portfolios/portfolios.service';
import { MovementType } from '@prisma/client';
import Decimal from 'decimal.js';

@Injectable()
export class MovementsService {
  constructor(
    private prisma: PrismaService,
    private portfoliosService: PortfoliosService
  ) {}

  /**
   * Registra un nuevo depósito o retiro para un usuario.
   */
  async register(userId: number, dto: RegisterMovementDto) {
    const amount = new Decimal(dto.amount);
    
    // 1. OBTENER ESTADO ACTUAL Y PREPARAR CAMBIOS
    const portfolio = await this.portfoliosService.getPortfolioState(userId);
    let newCash = new Decimal(portfolio.cash as any);

    if (dto.type === 'DEPOSIT') {
      newCash = newCash.plus(amount);
    } else { // WITHDRAWAL (Retiro)
      // Validación de fondos antes de retirar
      if (newCash.lessThan(amount)) {
        throw new ConflictException(
          `Fondos insuficientes para el retiro de ${amount}. Tienes ${newCash} disponible.`,
        );
      }
      newCash = newCash.minus(amount);
    }
    
    // 2. APLICAR CAMBIO DE ESTADO EN LA DB (Mutación)
    await this.prisma.portfolio.update({
      where: { userId },
      data: { cash: newCash },
    });

    // 3. REGISTRAR MOVIMIENTO HISTÓRICO
    const movement = await this.prisma.movement.create({
      data: {
        ...dto,
        type: dto.type as MovementType,
        date: new Date(dto.date),
        userId: userId,
      },
    });

    return movement;
  }

  /**
   * Consulta los últimos movimientos del usuario.
   */
  async findLatest(userId: number, limit: number = 10) {
    return this.prisma.movement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}