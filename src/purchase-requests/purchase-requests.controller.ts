import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PurchaseRequestsService } from './purchase-requests.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from '../ai/ai.service';

@UseGuards(JwtAuthGuard)
@Controller('purchase-requests')
export class PurchaseRequestsController {
  constructor(
    private readonly purchaseRequestsService: PurchaseRequestsService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  create(@Body() dto: CreatePurchaseRequestDto) {
    return this.purchaseRequestsService.create(dto);
  }

  // GET /purchase-requests ou GET /purchase-requests?status=pendente
  @Get()
  findAll(@Query('status') status?: string) {
    return this.purchaseRequestsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRequestsService.findOne(id);
  }

  // POST /purchase-requests/:id/review (gera o parecer com IA gpt-4o-mini)
  @Post(':id/review')
  review(@Param('id') id: string) {
    return this.aiService.analyzePurchaseRequest(id);
  }

  // PATCH /purchase-requests/:id/status (atualiza status para pendente, aprovado ou rejeitado)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.purchaseRequestsService.updateStatus(id, dto.status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseRequestDto) {
    return this.purchaseRequestsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseRequestsService.remove(id);
  }
}