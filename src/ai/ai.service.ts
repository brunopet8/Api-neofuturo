import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzePurchaseRequest(purchaseRequestId: string) {
    // 1. Localiza a solicitação no banco
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: purchaseRequestId },
    });

    if (!request) {
      throw new NotFoundException('Solicitação de compra não encontrada');
    }

    // 2. Prompt estruturado exigindo formato JSON
    const prompt = `
      Analise a solicitação de compra corporativa abaixo:
      Item: ${request.item_name}
      Quantidade: ${request.quantity}
      Justificativa: "${request.justification}"

      Responda ESTRITAMENTE em formato JSON com o seguinte schema:
      {
        "priority": "alta" | "media" | "baixa",
        "summary_text": "resumo de até 2 frases explicando o motivo da prioridade definida"
      }
    `;

    try {
      // 3. Chamada com modo JSON ativado
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const rawContent = completion.choices[0].message.content;
      if (!rawContent) {
        throw new Error('A OpenAI retornou uma resposta vazia');
      }

      const parsedResult = JSON.parse(rawContent);

      // 4. Salva a análise na tabela ai_reviews conectada à compra
      return await this.prisma.aiReview.create({
        data: {
          purchase_request_id: request.id,
          priority: parsedResult.priority || 'media',
          summary_text: parsedResult.summary_text || '',
        },
      });
    } catch (error) {
      console.error('Erro na integração com OpenAI:', error);
      throw new InternalServerErrorException('Falha ao processar análise de IA');
    }
  }
}