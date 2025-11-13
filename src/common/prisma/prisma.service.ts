import {  
  Injectable, 
  OnModuleInit, 
  OnModuleDestroy 
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Conecta con la base de datos al iniciar el módulo
    await this.$connect();
  }

  async onModuleDestroy() {
    // Desconecta de la base de datos al cerrar la aplicación
    await this.$disconnect();
  }
}