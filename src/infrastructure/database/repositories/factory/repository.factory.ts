import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MemorySpotRepository } from '../implementations/memory/memory-spot.repository';
import { MemoryVehicleRepository } from '../implementations/memory/memory-vehicle.repository';
import { MemoryTicketRepository } from '../implementations/memory/memory-ticket.repository';
// Importar outros repositórios quando implementados
// import { PostgresSpotRepository } from '../implementations/postgres/postgres-spot.repository';
// import { SqlServerSpotRepository } from '../implementations/sqlserver/sqlserver-spot.repository';

export const repositoryProviders: Provider[] = [
  {
    provide: 'SPOT_REPOSITORY',
    useFactory: (configService: ConfigService) => {
      const dbType = configService.get('database.type');
      
      switch (dbType) {
        // case 'postgres':
        //   return new PostgresSpotRepository();
        // case 'sqlserver':
        //   return new SqlServerSpotRepository();
        case 'memory':
        default:
          return new MemorySpotRepository();
      }
    },
    inject: [ConfigService],
  },
  {
    provide: 'VEHICLE_REPOSITORY',
    useFactory: (configService: ConfigService) => {
      const dbType = configService.get('database.type');
      
      switch (dbType) {
        // case 'postgres':
        //   return new PostgresVehicleRepository();
        // case 'sqlserver':
        //   return new SqlServerVehicleRepository();
        case 'memory':
        default:
          return new MemoryVehicleRepository();
      }
    },
    inject: [ConfigService],
  },
  {
    provide: 'TICKET_REPOSITORY',
    useFactory: (configService: ConfigService) => {
      const dbType = configService.get('database.type');
      
      switch (dbType) {
        // case 'postgres':
        //   return new PostgresTicketRepository();
        // case 'sqlserver':
        //   return new SqlServerTicketRepository();
        case 'memory':
        default:
          return new MemoryTicketRepository();
      }
    },
    inject: [ConfigService],
  },
];