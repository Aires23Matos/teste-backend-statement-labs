import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInRequest {
  @ApiProperty({ example: 'ABC1234', description: 'Placa do veículo' })
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  @Matches(/^[A-Z]{3}[0-9]{4}$/, {
    message: 'Placa deve estar no formato AAA9999',
  })
  licensePlate: string;

  @ApiProperty({ example: 'Toyota Corolla', required: false })
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Preto', required: false })
  @IsOptional()
  color?: string;
}