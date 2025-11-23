import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLogDocument>,
  ) {}

  async create(createDto: CreateWeatherLogDto): Promise<WeatherLog> {
    const created = new this.weatherModel(createDto);
    return created.save();
  }

  async findAll(): Promise<WeatherLog[]> {
    return this.weatherModel.find().sort({ timestamp: -1 }).exec();
  }
}
