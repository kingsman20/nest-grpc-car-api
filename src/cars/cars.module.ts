import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { CarsController } from './cars.controller';
import { CarsService as CarsDataService } from './cars.service';
import { carsProviders } from './cars.providers';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CAR_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsDataService, ...carsProviders],
})
export class CarsModule {}
