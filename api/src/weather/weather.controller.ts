import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import type { Response } from 'express';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('logs')
  async create(@Body() dto: CreateWeatherLogDto) {
    return this.weatherService.create(dto);
  }

  @Get('logs')
  async findAll() {
    return this.weatherService.findAll();
  }

  @Get('insights')
  async getInsights() {
    return this.weatherService.getInsights();
  }

  @Get('export.csv')
  async exportCSV(@Res() res: Response) {
    const csv = await this.weatherService.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  }

  @Get('export.xlsx')
  async exportXLSX(@Res() res: Response) {
    const buffer = await this.weatherService.exportXLSX();
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="logs.xlsx"',
    );
    res.send(buffer);
  }
}
