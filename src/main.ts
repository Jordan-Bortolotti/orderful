import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { XmlModule } from './xml/xml.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(XmlModule, {
    bodyParser: false,
    snapshot: true,
    abortOnError: false,
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
