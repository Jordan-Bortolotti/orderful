import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { XmlService } from '../xml/xml.service';
import { TextService } from '../text/text.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [JsonController],
  providers: [JsonService, XmlService, TextService],
})
export class JsonModule {}
