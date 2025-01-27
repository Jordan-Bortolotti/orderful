import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class XmlService {
  private readonly logger = new Logger(XmlService.name);

  getHello(): string {
    // this.logger.log('hello world service');
    return 'Hello World!';
  }
}
