import { IsNumber, IsString } from 'class-validator';

export class CreateWeatherLogDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  windspeed: number;

  @IsString()
  condition: string;

  @IsNumber()
  precipitation_probability: number;

  @IsString()
  timestamp: string;
}
