import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    WeatherModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
