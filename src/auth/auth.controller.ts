import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  OnModuleInit,
  Inject,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GrpcMethod, ClientGrpc } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from '../core/guards/doesUserExist.guard';

import { UserDetails } from './interfaces/user-details.interface';
import { UserData } from './interfaces/user-data.interface';
import { CarService } from './interfaces/car-service.interface';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private carService: CarService;

  constructor(
    private authService: AuthService,
    @Inject('CAR_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.carService = this.client.getService<CarService>('CarService');
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Request() req) {
    return await this.carService.login(req.user);
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    return await this.carService.register(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('topup')
  async create(@Body() amount, @Request() req) {
    const { id } = req.user;
    const topUpDetails = {
      ...amount,
      id,
    };
    return await this.carService.topUp(topUpDetails);
  }

  // GPRC Server methods implementation
  @GrpcMethod('CarService')
  async login(data: UserDetails): Promise<UserData> {
    return await this.authService.login(data);
  }

  @GrpcMethod('CarService')
  async register(data: UserDto): Promise<UserData> {
    return await this.authService.create(data);
  }

  @GrpcMethod('CarService')
  async topUp(data) {
    const { id } = data;
    const { balance, currency } = data;

    const amount = {
      balance,
      currency,
    };

    const res = await this.authService.topUp(amount, id);
    console.log(res);

    if (res.numberOfAffectedRows === 0) {
      throw new NotFoundException('Error in adding money to your account');
    }

    return res.resultData;
  }
}
