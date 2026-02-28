import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckOutRequest {
  @ApiProperty({
    example: 'ABC1234',
    description: 'Código do ticket ou placa do veículo',
  })
  @IsNotEmpty({ message: 'Código do ticket ou placa é obrigatório' })
  ticketCodeOrPlate: string;
}