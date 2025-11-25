import { Body, Controller, Get, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async create(@Body() body: any) {
    return this.weatherService.create(body);
  }

  @Get()
  async findAll() {
    return this.weatherService.findAll();
  }
}
