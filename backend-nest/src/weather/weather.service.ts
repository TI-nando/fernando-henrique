import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>) {}

  // Lógica de IA (já existente)
  private generateInsight(temp: number, humidity: number, condition: string): string {
    const alerts: string[] = [];
    if (temp > 35) alerts.push('🔥 Calor extremo! Risco de insolação.');
    else if (temp > 30) alerts.push('☀️ Dia quente. Hidrate-se bem.');
    else if (temp < 15) alerts.push('❄️ Temperatura baixa. Leve um casaco.');
    else alerts.push('🌡️ Temperatura agradável.');

    if (humidity < 30) alerts.push('🌵 Ar muito seco. Cuidado com alergias.');
    else if (humidity > 80) alerts.push('💧 Umidade alta. Sensação de abafamento.');

    const rainCodes = ['51', '53', '55', '61', '63', '65', '80', '81', '82', '95'];
    if (rainCodes.includes(condition)) {
      alerts.push('☔ Chance de chuva. Não esqueça o guarda-chuva!');
    }
    return alerts.join(' ');
  }

  async create(data: any): Promise<Weather> {
    const insightText = this.generateInsight(data.temperature, data.humidity, data.condition);
    const finalData = { ...data, insight: insightText };
    const createdWeather = new this.weatherModel(finalData);
    return createdWeather.save();
  }

  async findAll(): Promise<Weather[]> {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  // 👇 NOVA FUNÇÃO: GERA O CSV MANUALMENTE
  async getCsv(): Promise<string> {
    const data = await this.weatherModel.find().sort({ createdAt: -1 }).exec();

    // Cabeçalho do CSV
    const header = 'Data,Cidade,Temperatura,Umidade,Vento,Condicao,Insight\n';

    // Linhas do CSV
    const rows = data
      .map((row) => {
        const date = row['createdAt'] ? new Date(row['createdAt']).toISOString() : new Date().toISOString();
        // Tratamos o insight para não quebrar o CSV se tiver vírgulas (colocamos entre aspas)
        const safeInsight = row.insight ? `"${row.insight.replace(/"/g, '""')}"` : '';

        return `${date},${row.city},${row.temperature},${row.humidity},${row.windSpeed},${row.condition},${safeInsight}`;
      })
      .join('\n');

    return header + rows;
  }
}
