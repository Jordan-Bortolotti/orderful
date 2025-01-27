import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [XmlController],
  providers: [XmlService],
})
export class XmlModule {}
