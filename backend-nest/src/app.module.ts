import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';

// Imports dos novos módulos manuais
import { UsersService } from './users/users.service';
import { User, UserSchema } from './users/schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    // Conexão Mongo (mantemos 'mongodb' para o Docker)
    MongooseModule.forRoot('mongodb://admin:password123@mongodb:27017/gdash?authSource=admin'),

    // Configuração do Banco de Usuários
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Configuração do JWT (Segredo simples para o teste)
    JwtModule.register({
      global: true,
      secret: 'SEGREDO_SUPER_SECRETO_DO_GDASH',
      signOptions: { expiresIn: '1h' },
    }),

    WeatherModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}
