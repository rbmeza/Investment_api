// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async update(userId: number, updateUserDto: UpdateUserDto) {
    // 1. Omitir los campos nulos o vacíos del DTO
    const dataToUpdate = Object.keys(updateUserDto).reduce((acc, key) => {
        if (updateUserDto[key] !== undefined) {
            acc[key] = updateUserDto[key];
        }
        return acc;
    }, {});

    try {
      // 2. Ejecutar la actualización en la DB, excluyendo el password
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true }, 
      });
      return user;
    } catch (error) {
      // Manejo de errores si el usuario no existe (aunque el Guard debería impedirlo)
      if (error.code === 'P2025') { 
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
      }
      throw error;
    }
  }
}