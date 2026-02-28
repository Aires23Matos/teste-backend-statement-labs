import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParkingController } from './presentation/controllers/parking.controller';
import { ParkingService } from './application/services/parking.service';
import { repositoryProviders } from './infrastructure/database/repositories/factory/repository.factory';
import databaseConfig from './infrastructure/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
  ],
  controllers: [ParkingController],
  providers: [ParkingService, ...repositoryProviders],
})
export class AppModule {}
