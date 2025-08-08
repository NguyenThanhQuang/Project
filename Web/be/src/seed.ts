// be/src/seed.ts

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseSeedModule } from './database/seeds/database-seed.module';
import { MainSeeder } from './database/seeds/main.seeder';

async function bootstrap() {
  const logger = new Logger('Seeder');
  // Tạo một application context, không phải web server
  const app = await NestFactory.createApplicationContext(DatabaseSeedModule);

  logger.log('Lấy instance của MainSeeder từ application context...');
  const seeder = app.get(MainSeeder);

  try {
    await seeder.run();
    logger.log('Quá trình seed dữ liệu đã hoàn tất thành công.');
  } catch (error) {
    logger.error('Đã có lỗi xảy ra trong quá trình seed dữ liệu!');
    logger.error(error);
  } finally {
    // Đóng application context
    await app.close();
    process.exit(0);
  }
}

bootstrap();
