import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePurchaseRequestDto {
  @IsNotEmpty({ message: 'item_name é obrigatório' })
  @IsString()
  item_name: string;

  @IsNotEmpty({ message: 'quantity é obrigatório' })
  @IsInt({ message: 'quantity deve ser um número inteiro' })
  @Min(1, { message: 'quantity deve ser maior que zero' })
  quantity: number;

  @IsNotEmpty({ message: 'requester_name é obrigatório' })
  @IsString()
  requester_name: string;

  @IsNotEmpty({ message: 'justification é obrigatório' })
  @IsString()
  justification: string;

  @IsOptional()
  @IsString()
  supplier_id?: string;
}