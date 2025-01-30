import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { js2xml } from 'xml-js';
import { Logger } from 'nestjs-pino';

@Injectable()
export class XmlService {
  constructor(private readonly logger: Logger) {}

  public parseToPlainObject(file: Express.Multer.File): Record<string, any> {
    const parser = new XMLParser();
    const parsedFile = <Record<string, any>>(
      parser.parse(file?.buffer.toString(), true)
    );

    this.logger.log(
      `parsed File as Object:  ${JSON.stringify(parsedFile.root)}`,
    );

    return <Record<string, any>>parsedFile.root;
  }

  public convertToXml(plainObject: Record<string, any>): string {
    const xml = js2xml(
      { root: plainObject },
      { compact: true, ignoreComment: true, spaces: 4 },
    );
    const prependXmlVersionTag = '<?xml version="1.0" encoding="UTF-8"?>\n';
    this.logger.log(
      `converted plain object to xml: ${prependXmlVersionTag + xml}`,
    );

    return prependXmlVersionTag + xml;
  }
}
