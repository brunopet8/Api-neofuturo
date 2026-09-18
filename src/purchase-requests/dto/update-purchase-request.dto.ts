import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseRequestDto } from './create-purchase-request.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdatePurchaseRequestDto extends PartialType(CreatePurchaseRequestDto) {
  @IsOptional()
  @IsString()
  @IsIn(['pendente', 'aprovado', 'rejeitado'], {
    message: 'status deve ser pendente, aprovado ou rejeitado',
  })
  status?: string;
}