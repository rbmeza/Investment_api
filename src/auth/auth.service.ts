import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. REGISTRO
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      },
      select: { id: true, email: true, firstName: true },
    });

    await this.prisma.portfolio.create({
        data: {
            name: `${user.firstName}'s Portfolio`,
            userId: user.id,
            stocksHeld: { "META": 1 }
        }
    });

    return user;
  }

  // 2. LOGIN
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });

    if (!user) throw new ForbiddenException('Email ingresado no tiene una cuenta creada.')

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) throw new UnauthorizedException('Contraseña inválida.')

    const payload = { 
      email: user.email, 
      sub: user.id
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}