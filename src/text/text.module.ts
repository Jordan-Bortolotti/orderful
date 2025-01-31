import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { XmlService } from '../xml/xml.service';
import { TextController } from '../text/text.controller';
import { TextService } from '../text/text.service';
import { JsonService } from '../json/json.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [TextController],
  providers: [TextService, XmlService, JsonService],
})
export class TextModule {}
