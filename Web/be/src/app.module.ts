import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { UrlBuilderModule } from './common/utils/url-builder.module';
import { CompaniesModule } from './companies/companies.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LocationsModule } from './locations/locations.module';
import { MailModule } from './mail/mail.module';
import { MapsModule } from './maps/maps.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    // 1. Cron Job & Events
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),

    // 2. Configuration & Env Validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // --- Server & Environment ---
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),

        // --- Database ---
        MONGO_URI: Joi.string().required().description('Chuỗi kết nối MongoDB'),

        // --- Security & Auth ---
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('3600s'),

        // --- Business Logic Constants (Tránh Magic Numbers) ---
        SEAT_HOLD_DURATION_MINUTES: Joi.number().default(15),
        EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MS: Joi.number().default(86400000),
        PASSWORD_RESET_TOKEN_EXPIRES_IN_MS: Joi.number().default(3600000),
        REVIEW_EDIT_WINDOW_DAYS: Joi.number().default(7),
        COMMISSION_RATE: Joi.number().default(0.15),

        // --- Mail Service (Gmail SMTP) ---
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_SECURE: Joi.boolean().default(false),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM_ADDRESS: Joi.string().required(),
        MAIL_FROM_NAME: Joi.string().default('Online Bus Ticket'),

        // --- Client & URLs ---
        API_BASE_URL: Joi.string()
          .required()
          .description('URL của Backend API'),
        CLIENT_URL: Joi.string()
          .required()
          .description('URL của Frontend Client'),
        PUBLIC_URL: Joi.string().default('http://localhost:3000'),

        // --- Payment (PayOS) ---
        PAYOS_CLIENT_ID: Joi.string().required(),
        PAYOS_API_KEY: Joi.string().required(),
        PAYOS_CHECKSUM_KEY: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // 3. Database Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    // 4. Feature Modules
    UsersModule,
    AuthModule,
    CompaniesModule,
    VehiclesModule,
    TripsModule,
    MailModule,
    LocationsModule,
    MapsModule,
    BookingsModule,
    NotificationsModule,
    DashboardModule,
    PaymentsModule,
    ReviewsModule,
    UrlBuilderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
