import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  // app.useGlobalInterceptors(new TransformInterceptor());

  const clientUrl = configService.get<string>('CLIENT_URL');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin.includes('localhost') ||
        origin === clientUrl ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  logger.log(`Ứng dụng đang chạy tại: http://localhost:${port}/api`);
}
void bootstrap();
