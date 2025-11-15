import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async update(userId: number, dataToUpdate: Record<string, any>) {

    try {
      // 1. Ejecutar la actualización en la DB con los datos ya limpios
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: { 
          id: true, email: true, firstName: true, 
          lastName: true, createdAt: true, updatedAt: true 
        }, 
      });
    return user;
    } catch (error) {
      if (error.code === 'P2025') { 
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
      }
      throw error;
    }
  }
}