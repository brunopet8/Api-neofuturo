import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase-request.dto';

@Injectable()
export class PurchaseRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePurchaseRequestDto) {
    if (dto.supplier_id) {
      const supplierExists = await this.prisma.supplier.findUnique({
        where: { id: dto.supplier_id },
      });
      if (!supplierExists) {
        throw new BadRequestException('supplier_id informado não existe');
      }
    }

    return this.prisma.purchaseRequest.create({
      data: dto,
      include: { supplier: true },
    });
  }

  // Agora aceita filtro opcional por status (?status=pendente)
  findAll(status?: string) {
    return this.prisma.purchaseRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        supplier: true,
        ai_reviews: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        supplier: true,
        ai_reviews: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Solicitação com id ${id} não encontrada`);
    }

    return request;
  }

  async update(id: string, dto: UpdatePurchaseRequestDto) {
    await this.findOne(id);

    if (dto.supplier_id) {
      const supplierExists = await this.prisma.supplier.findUnique({
        where: { id: dto.supplier_id },
      });
      if (!supplierExists) {
        throw new BadRequestException('supplier_id informado não existe');
      }
    }

    return this.prisma.purchaseRequest.update({
      where: { id },
      data: dto,
      include: { supplier: true },
    });
  }

  // Novo método específico para PATCH /purchase-requests/:id/status
  async updateStatus(id: string, status: string) {
    await this.findOne(id);

    return this.prisma.purchaseRequest.update({
      where: { id },
      data: { status },
      include: {
        supplier: true,
        ai_reviews: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.purchaseRequest.delete({
      where: { id },
    });
  }
}