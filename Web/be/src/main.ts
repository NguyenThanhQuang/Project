import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3001;

  app.setGlobalPrefix('api');

  const clientUrl = configService.get<string>('CLIENT_URL');
  app.enableCors({
    origin: clientUrl,
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

  // await app.listen(port, '0.0.0.0');
  await app.listen(port);
  logger.log(`Ứng dụng đang chạy tại: http://localhost:${port}/api`);
}
void bootstrap();
