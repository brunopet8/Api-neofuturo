import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'status é obrigatório' })
  @IsString()
  @IsIn(['pendente', 'aprovado', 'rejeitado'], {
    message: 'status deve ser pendente, aprovado ou rejeitado',
  })
  status: string;
}