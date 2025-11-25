import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherDocument = HydratedDocument<Weather>;

@Schema({ timestamps: true })
export class Weather {
  @Prop()
  city: string;

  @Prop()
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  windSpeed: number;

  @Prop()
  condition: string;

  @Prop()
  insight: string;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
