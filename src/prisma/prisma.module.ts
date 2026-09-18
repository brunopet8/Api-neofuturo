import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Deixa o Prisma disponível no projeto inteiro sem precisar reimportar em todo lugar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}