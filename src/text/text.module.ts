import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { XmlService } from 'src/xml/xml.service';
import { XmlModule } from 'src/xml/xml.module';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { JsonService } from 'src/json/json.service';

@Module({
  imports: [LoggerModule.forRoot(), XmlModule],
  controllers: [TextController],
  providers: [TextService, XmlService, JsonService],
})
export class TextModule {}
