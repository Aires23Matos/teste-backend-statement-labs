import { Injectable } from '@nestjs/common';
import { ISpotRepository } from '../../../../../domain/interfaces/repository.interface';
import { Spot } from '../../../../../domain/entities/spot.entity';
import { SpotStatus } from '../../../../../domain/enums/spot-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MemorySpotRepository implements ISpotRepository {
  private spots: Spot[] = [];

  constructor() {
    // Inicializar com 50 vagas
    for (let i = 1; i <= 50; i++) {
      const spotNumber = i.toString().padStart(2, '0');
      this.spots.push(
        new Spot({
          id: uuidv4(),
          spotNumber,
          status: SpotStatus.LIVRE,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
    }
  }

  async findFirstAvailable(): Promise<Spot | null> {
    return this.spots.find((spot) => spot.status === SpotStatus.LIVRE) || null;
  }

  async findAllAvailable(): Promise<Spot[]> {
    return this.spots.filter((spot) => spot.status === SpotStatus.LIVRE);
  }

  async findAll(): Promise<Spot[]> {
    return [...this.spots];
  }

  async findBySpotNumber(spotNumber: string): Promise<Spot | null> {
    return this.spots.find((spot) => spot.spotNumber === spotNumber) || null;
  }

  async update(spot: Spot): Promise<Spot> {
    const index = this.spots.findIndex((s) => s.id === spot.id);
    if (index >= 0) {
      this.spots[index] = spot;
    }
    return spot;
  }

  async save(spot: Spot): Promise<Spot> {
    if (!spot.id) {
      spot.id = uuidv4();
    }
    this.spots.push(spot);
    return spot;
  }
}