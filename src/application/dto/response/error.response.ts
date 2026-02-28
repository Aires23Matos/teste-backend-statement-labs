import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  status: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ required: false })
  validationErrors?: Record<string, string>;
}