import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { RegisterMovementDto } from './dto/register-movement.dto';
import { MovementType } from '@prisma/client';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registra un nuevo depósito o retiro para un usuario.
   */
  async register(userId: number, registerMovementDto: RegisterMovementDto) {
    // 1. Convertir el DTO para Prisma
    const { amount, date, type } = registerMovementDto;
    
    // 2. Crear el registro en la DB
    return this.prisma.movement.create({
      data: {
        amount,
        date: new Date(date), // Aseguramos que la fecha sea un objeto Date
        type: type as MovementType, // Asignamos el ENUM de Prisma
        userId: userId,
      },
      // Excluir la relación completa del usuario en la respuesta para mantenerla limpia
      select: { id: true, type: true, amount: true, date: true, userId: true },
    });
  }

  /**
   * Consulta los últimos movimientos del usuario.
   */
  async findLatest(userId: number, limit: number = 10) {
    return this.prisma.movement.findMany({
      where: { userId },
      orderBy: { date: 'desc' }, // Ordena por fecha descendente
      take: limit, // Limita la cantidad de resultados
    });
  }
}