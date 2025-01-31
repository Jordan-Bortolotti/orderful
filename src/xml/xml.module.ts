import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';
import { JsonService } from '../json/json.service';
import { TextService } from '../text/text.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [XmlController],
  providers: [XmlService, JsonService, TextService],
})
export class XmlModule {}
