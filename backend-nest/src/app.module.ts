import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    // admin:password123 são as credenciais que defini no docker-compose.yml
    MongooseModule.forRoot(
      'mongodb://admin:password123@mongodb:27017/gdash?authSource=admin',
    ),
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
