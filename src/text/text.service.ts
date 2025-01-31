import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TextService {
  constructor(private readonly logger: Logger) {}

  public parseToPlainObject(
    file: Express.Multer.File,
    lineSeparator: string,
    elementSeparator: string,
  ): Record<string, Array<Record<string, string>>> {
    this.logger.log(
      `Parsing file contents using passed in separators: ${file.buffer.toString('utf-8')}, lineSeparator: ${lineSeparator}, elementSeparator: ${elementSeparator}`,
      this.parseToPlainObject.name,
    );

    const input = file.buffer.toString('utf-8');
    const result: Record<string, Array<Record<string, string>>> = {};
    const lines = input.split(lineSeparator).filter((line) => line.trim());

    for (const line of lines) {
      const elements = line.split(elementSeparator);
      if (elements.length < 1) continue;

      const [key, ...values] = elements;
      if (!key) continue;

      const cleanedKey = key.trim();

      const entry: Record<string, string> = {};
      values.forEach((value, index) => {
        if (!value) return;
        const propName = `${cleanedKey}${index + 1}`;
        entry[propName] = value.trim();
      });

      if (!result[cleanedKey]) {
        result[cleanedKey] = [];
      }
      result[cleanedKey].push(entry);
    }

    return result;
  }

  public convertToText(
    plainObject: Record<string, any>,
    lineSeparator: string,
    elementSeparator: string,
  ): string {
    const lines: string[] = [];
    this.logger.log(
      `converting plain object to text: ${JSON.stringify(plainObject)}, lineSeparator: ${lineSeparator}, elementSeparator: ${elementSeparator}`,
      this.convertToText.name,
    );

    for (const [key, segments] of Object.entries(plainObject)) {
      const normalizedSegments = Array.isArray(segments)
        ? segments
        : [segments];

      for (const element of normalizedSegments) {
        const values =
          typeof element === 'object' && !Array.isArray(element)
            ? Object.values(element)
            : Array.isArray(element)
              ? element
              : [element];
        lines.push([key, ...values.map(String)].join(elementSeparator));
      }
    }
    let resultingText = lines.join(lineSeparator + '\n');
    if (lines.length > 0 && !resultingText.endsWith(lineSeparator)) {
      resultingText += lineSeparator;
    }
    return resultingText;
  }
}
