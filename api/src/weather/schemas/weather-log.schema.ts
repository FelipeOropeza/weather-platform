import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({ collection: 'weather_logs' })
export class WeatherLog {
  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  windspeed: number;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  precipitation_probability: number;

  @Prop({ required: true })
  timestamp: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
