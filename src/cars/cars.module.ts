import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

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
  providers: [CarsService]
})
export class CarsModule {}
