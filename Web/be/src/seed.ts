import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);

  const logger = appContext.get(SeedService)['logger'];
  logger.log('Seed application context initialized.');

  try {
    const seedService = appContext.get(SeedService);
    await seedService.seedAll();
    logger.log('Seeding process completed successfully.');
  } catch (error) {
    console.error('Seeding process failed:', error);
  } finally {
    await appContext.close();
    process.exit(0);
  }
}

bootstrap();
