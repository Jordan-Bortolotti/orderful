import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';
import { LoggerModule } from 'nestjs-pino';
import { JsonService } from 'src/json/json.service';
import { TextService } from 'src/text/text.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [XmlController],
  providers: [XmlService, JsonService, TextService],
})
export class XmlModule {}
