import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { LoggerModule } from 'nestjs-pino';
import { XmlService } from 'src/xml/xml.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [JsonController],
  providers: [
    JsonService,
    XmlService,
    // TextService
  ],
  exports: [JsonService],
})
export class JsonModule {}
