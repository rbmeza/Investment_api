// src/auth/auth.service.ts (Versión simplificada)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto'; // Necesitarás crear este DTO
import { LoginDto } from './dto/login.dto';     // Necesitarás crear este DTO

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. REGISTRO
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      },
      select: { id: true, email: true, firstName: true }, // Excluir password
    });

    // También creamos un portafolio inicial
    await this.prisma.portfolio.create({
        data: {
            name: `${user.firstName}'s Portfolio`,
            targetAllocation: '{}',
            userId: user.id
        }
    });

    return user;
  }

  // 2. LOGIN
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Compara la contraseña
    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Generar el Payload (información del usuario para el token)
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}