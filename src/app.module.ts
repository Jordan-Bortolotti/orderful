import { Module } from '@nestjs/common';
import { XmlModule } from './xml/xml.module';
import { LoggerModule } from 'nestjs-pino';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { JsonModule } from './json/json.module';
import { TextModule } from './text/text.module';

@Module({
  imports: [
    JsonModule,
    TextModule,
    XmlModule,

    LoggerModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class AppModule {}
