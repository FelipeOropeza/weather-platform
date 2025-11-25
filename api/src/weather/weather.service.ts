import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>,
  ) {}

  async create(createDto: CreateWeatherLogDto): Promise<WeatherLog> {
    const created = new this.weatherModel(createDto);
    return created.save();
  }

  async findAll(): Promise<WeatherLog[]> {
    return this.weatherModel.find().sort({ timestamp: -1 }).exec();
  }

  async getInsights() {
    const data = await this.weatherModel.find().exec();

    if (data.length === 0) {
      return { message: 'Sem dados suficientes.' };
    }

    const avgTemp =
      data.reduce((sum, x) => sum + x.temperature, 0) / data.length;

    const maxRainChance = Math.max(
      ...data.map((x) => x.precipitation_probability),
    );

    const windyDays = data.filter((x) => x.windspeed > 20).length;

    return {
      avgTemperature: Number(avgTemp.toFixed(2)),
      highestRainChance: maxRainChance,
      windyDays,
      totalRecords: data.length,
    };
  }

  async exportCSV(): Promise<string> {
    const logs = await this.findAll();

    const csv =
      'temperature,humidity,windspeed,condition,precipitation_probability,timestamp\n' +
      logs
        .map(
          (l) =>
            `${l.temperature},${l.humidity},${l.windspeed},${l.condition},${l.precipitation_probability},${l.timestamp}`,
        )
        .join('\n');

    return csv;
  }

  async exportXLSX() {
    const logs = await this.weatherModel.find().lean().exec();

    const worksheet = XLSX.utils.json_to_sheet(logs);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weather Logs');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
