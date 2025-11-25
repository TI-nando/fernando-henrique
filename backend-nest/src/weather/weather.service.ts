import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>) {}

  // 👇 A CORREÇÃO ESTÁ AQUI NA TIPAGEM DO ARRAY (: string[])
  private generateInsight(temp: number, humidity: number, condition: string): string {
    const alerts: string[] = []; // <--- Agora o TypeScript sabe que aceita textos

    // Análise de Temperatura
    if (temp > 35) alerts.push('🔥 Calor extremo! Risco de insolação.');
    else if (temp > 30) alerts.push('☀️ Dia quente. Hidrate-se bem.');
    else if (temp < 15) alerts.push('❄️ Temperatura baixa. Leve um casaco.');
    else alerts.push('🌡️ Temperatura agradável.');

    // Análise de Umidade
    if (humidity < 30) alerts.push('🌵 Ar muito seco. Cuidado com alergias.');
    else if (humidity > 80) alerts.push('💧 Umidade alta. Sensação de abafamento.');

    // Análise de Condição (Chuva)
    const rainCodes = ['51', '53', '55', '61', '63', '65', '80', '81', '82', '95'];
    if (rainCodes.includes(condition)) {
      alerts.push('☔ Chance de chuva. Não esqueça o guarda-chuva!');
    }

    return alerts.join(' ');
  }

  async create(data: any): Promise<Weather> {
    // Antes de salvar, geramos o insight
    const insightText = this.generateInsight(data.temperature, data.humidity, data.condition);

    // Adicionamos o insight ao objeto que será salvo
    const finalData = { ...data, insight: insightText };

    const createdWeather = new this.weatherModel(finalData);
    return createdWeather.save();
  }

  async findAll(): Promise<Weather[]> {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }
}
