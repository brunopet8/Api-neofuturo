import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa a validação automática em todas as rotas da API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não foram definidos no DTO
      forbidNonWhitelisted: true, // Rejeita requisições se mandarem dados extras não permitidos
      transform: true, // Converte tipos automaticamente (ex: string para número se necessário)
    }),
  );

  await app.listen(3000);
}
bootstrap();