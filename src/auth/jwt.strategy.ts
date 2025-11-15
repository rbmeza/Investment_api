import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Esta función se llama después de validar la firma del token
  async validate(payload: { sub: number, email: string }) {
    // Buscamos el usuario en la DB
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return { userId: user.id, email: user.email, firstName: user.firstName };
  }
}