export class CreateWeatherLogDto {
  temperature: number;
  humidity: number;
  windspeed: number;
  condition: string;
  precipitation_probability: number;
  timestamp: string;
}
