import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class JsonService {
  constructor(private readonly logger: Logger) {}

  public parseToPlainObject(file: Express.Multer.File): Record<string, any> {
    const parsedFile = <Record<string, any>>JSON.parse(file?.buffer.toString());

    this.logger.verbose(
      `parsed File as Object:  ${JSON.stringify(parsedFile)}`,
    );

    return parsedFile;
  }

  public convertToJson(plainObject: Record<string, any>): Record<string, any> {
    this.logger.verbose(
      `converted plain object to json: ${JSON.stringify(plainObject)}`,
    );
    return plainObject;
  }
}
