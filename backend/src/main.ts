import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { createLogger, getLogFormatFromEnv } from './logger';

async function bootstrap() {
  const logFormat = getLogFormatFromEnv();
  const logger = createLogger(logFormat);
  
  console.log(`Starting server with ${logFormat.toUpperCase()} logger`);
  
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
