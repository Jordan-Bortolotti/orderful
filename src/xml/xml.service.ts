import { Injectable } from '@nestjs/common';

@Injectable()
export class XmlService {
  getHello(): string {
    return 'Hello World!';
  }
}
