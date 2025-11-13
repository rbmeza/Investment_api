import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_SECRETO_JWT_SUPER_SEGURO', // ¡DEBE COINCIDIR!
    });
  }

  // Esta función se llama después de validar la firma del token
  async validate(payload: { sub: number, email: string }) {
    // Buscamos el usuario en la DB
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    // Devolvemos el usuario (sin password) para que esté disponible en el Request
    return { userId: user.id, email: user.email, firstName: user.firstName };
  }
}