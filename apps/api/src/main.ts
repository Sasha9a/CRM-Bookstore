/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppModule } from "./app/app.module";
import { NestFactory } from '@nestjs/core';

async function bootstrap() { // Функция инициализации серверной части проекта
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  const port = process.env['PORT'] || 3000;
  await app.listen(port, () => {
    console.log(`Сервер запущен по адресу: http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap().catch(console.error);
