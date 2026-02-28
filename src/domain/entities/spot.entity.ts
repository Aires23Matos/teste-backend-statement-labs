import { SpotStatus } from '../enums/spot-status.enum';

export class Spot {
  id?: string;
  spotNumber: string;
  status: SpotStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Spot>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    this.status = this.status || SpotStatus.LIVRE;
  }

  occupy(): void {
    if (this.status !== SpotStatus.LIVRE) {
      throw new Error('Vaga não está disponível');
    }
    this.status = SpotStatus.OCUPADO;
    this.updatedAt = new Date();
  }

  release(): void {
    if (this.status !== SpotStatus.OCUPADO) {
      throw new Error('Vaga não está ocupada');
    }
    this.status = SpotStatus.LIVRE;
    this.updatedAt = new Date();
  }
}