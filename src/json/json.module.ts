import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { LoggerModule } from 'nestjs-pino';
import { XmlService } from 'src/xml/xml.service';
import { TextService } from 'src/text/text.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [JsonController],
  providers: [JsonService, XmlService, TextService],
})
export class JsonModule {}
