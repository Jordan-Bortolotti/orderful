import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';
import { LoggerModule } from 'nestjs-pino';
import { JsonService } from 'src/json/json.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [XmlController],
  providers: [XmlService, JsonService],
})
export class XmlModule {}
