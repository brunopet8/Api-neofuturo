import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Conecta no banco assim que a aplicação liga
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconecta com segurança se o servidor parar
  }
}