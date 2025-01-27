import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import logger from './common/middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    snapshot: true,
    abortOnError: false,
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.use(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
