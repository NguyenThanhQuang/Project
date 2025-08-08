import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from '../../companies/companies.module';
import { LocationsModule } from '../../locations/locations.module';
import { MapsModule } from '../../maps/maps.module';
import { TripsModule } from '../../trips/trips.module';
import { VehiclesModule } from '../../vehicles/vehicles.module';
import { MainSeeder } from './../seeds/main.seeder';

@Module({
  imports: [
    // Import các module mà seeder cần để sử dụng service của chúng
    ConfigModule.forRoot({ isGlobal: true }),
    // Kết nối database cho context của seeder
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CompaniesModule,
    VehiclesModule,
    LocationsModule,
    TripsModule,
    MapsModule, // TripsService có thể phụ thuộc vào MapsService
  ],
  providers: [
    // Đăng ký MainSeeder để có thể inject vào script
    MainSeeder,
  ],
})
export class DatabaseSeedModule {}
