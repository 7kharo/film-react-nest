import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { createLogger, getLogFormatFromEnv } from './logger';

async function bootstrap() {
  const logFormat = getLogFormatFromEnv();
  const logger = createLogger(logFormat);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  await app.listen(3000);
  logger.log(`Application is running on: http://localhost:3000/api/afisha`);
}
bootstrap();