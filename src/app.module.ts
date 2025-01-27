import { Module } from '@nestjs/common';
import { XmlModule } from './xml/xml.module';
import { LoggerModule } from 'nestjs-pino';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    XmlModule,
    LoggerModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class AppModule {}
