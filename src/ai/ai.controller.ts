import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze/:purchaseRequestId')
  analyze(@Param('purchaseRequestId') purchaseRequestId: string) {
    return this.aiService.analyzePurchaseRequest(purchaseRequestId);
  }
}