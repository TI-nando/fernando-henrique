import { Body, Controller, Get, Header, Post } from '@nestjs/common';
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

  // 👇 NOVA ROTA DE EXPORTAÇÃO
  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=dados_climaticos.csv')
  async exportCsv() {
    return this.weatherService.getCsv();
  }
}
