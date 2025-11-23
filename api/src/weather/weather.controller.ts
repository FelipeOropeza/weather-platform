import { Controller, Post, Body, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Recebe dados do worker Go
  @Post('logs')
  async create(@Body() createDto: CreateWeatherLogDto) {
    return this.weatherService.create(createDto);
  }

  // Lista registros
  @Get('logs')
  async findAll() {
    return this.weatherService.findAll();
  }

  @Get('teste')
  async teste() {
    return { message: 'API is working!' };
  }
}
