import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GrpcMethod, ClientGrpc } from '@nestjs/microservices';

import { CarsService as CarsDataService } from './cars.service';
import { Car as CarEntity } from './car.entity';
import { CarDto } from './dto/car.dto';
import { Car } from './interfaces/car.interface';
import { CarService } from './interfaces/car-service.interface';
import { CarById } from './interfaces/car-by-id.interface';
import { Observable } from 'rxjs';
import { CarDetails } from './interfaces/car-details.interface';

@Controller('cars')
export class CarsController implements OnModuleInit {
  private carService: CarService;

  constructor(
    private readonly carsDataService: CarsDataService,
    @Inject('CAR_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.carService = this.client.getService<CarService>('CarService');
  }

  @Get()
  async listCars() {
    // get all cars in the db
    console.log('In list cars');
    return await this.carService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const car = await this.carService.findOne({ id: id });
    // if the car doesn't exit in the db, throw a 404 error
    if (!car) {
      throw new NotFoundException("This car doesn't exist");
    }
    return car;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() car: CarDto, @Request() req) {
    const { id } = req.user;
    const carDetails: CarDetails = {
      ...car,
      id,
    };
    return await this.carService.createCar(carDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':carId/buy')
  async buy(
    @Param('carId') carId: number,
    @Request() req,
  ) {

    const { balance } = req.user;

    const purchaseDetails = {
      balance,
      carId
    }

    return await this.carService.buyCar(purchaseDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':carId')
  async update(
    @Param('carId') carId: number,
    @Body() car: CarDto,
    @Request() req,
  ): Promise<Car> {
    const { id } = req.user;
    const carDetails: CarDetails = {
      carId,
      ...car,
      id,
    };
    console.log(carDetails);
    // get the number of row affected and the updated car
    const {
      numberOfAffectedRows,
      updatedCar,
    } = await this.carService.updateCar(carDetails);

    // console.log(numberOfAffectedRows);
    // console.log(updatedCar);

    // if the number of row affected is zero, it means the car doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        "This car doesn't exist or you are not authorized to modify it",
      );
    }

    // return the updated car
    return updatedCar;
  }

  // GPRC Methods
  @GrpcMethod('CarService', 'FindAll')
  async findAll(): Promise<Car[]> {
    console.log('In GRPC');
    return await this.carsDataService.findAll();
  }

  @GrpcMethod('CarService')
  async findOne(data: CarById): Promise<Car> {
    return await this.carsDataService.findOne(data.id);
  }

  @GrpcMethod('CarService')
  async createCar(data: CarDetails): Promise<Car> {
    const userId = data.id;
    const { make, model, features, vin, price, location } = data;
    const carData = {
      make,
      model,
      features,
      vin,
      price,
      location,
    };
    return await this.carsDataService.create(carData, userId);
  }

  @GrpcMethod('CarService')
  async updateCar(data: CarDetails) {
    const userId = data.id;
    const { make, model, features, vin, price, location } = data;
    const carId = data.carId;
    const carData = {
      make,
      model,
      features,
      vin,
      price,
      location,
    };

    return await this.carsDataService.update(carId, carData, userId);
  }

  @GrpcMethod('CarService')
  async buyCar(data) {

    const {balance, carId} = data

    const res = await this.carsDataService.buy(balance, carId);

    return res;

  }
}
