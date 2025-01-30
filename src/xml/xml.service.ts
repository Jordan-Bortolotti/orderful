import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { Logger } from 'nestjs-pino';

@Injectable()
export class XmlService {
  constructor(private readonly logger: Logger) {}

  parseAsXml(file: Express.Multer.File): any {
    const parser = new XMLParser();
    let parsedFile = parser.parse(file?.buffer.toString(), true);

    this.logger.log(`parsed File as Object:  ${JSON.stringify(parsedFile)}`);
    return parsedFile;
  }
}
