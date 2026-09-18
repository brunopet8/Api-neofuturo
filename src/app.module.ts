import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseRequestsModule } from './purchase-requests/purchase-requests.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [PrismaModule, AuthModule, SuppliersModule, PurchaseRequestsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
