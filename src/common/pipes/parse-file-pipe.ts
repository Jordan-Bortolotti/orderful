import { Injectable, FileValidator } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

export enum FILE_TYPES {
  XML = 'xml',
  JSON = 'json',
  TEXT = 'text',
}

export interface IFileTypeOptions {
  fileType: FILE_TYPES;
}

@Injectable()
export class ValidateFileParsing extends FileValidator {
  protected validationOptions: { acceptedFileType: FILE_TYPES };

  constructor(options: IFileTypeOptions) {
    super(options);
    this.validationOptions.acceptedFileType = options.fileType;
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    let result = false;
    try {
      switch (this.validationOptions.acceptedFileType) {
        case FILE_TYPES.JSON: {
          // throws error if json parsing fails
          JSON.parse(file?.buffer.toString());
          result = true;

          break;
        }
        case FILE_TYPES.TEXT: {
          // parse text
          break;
        }
        case FILE_TYPES.XML: {
          const parser = new XMLParser();
          // throws error if xml parsing fails
          parser.parse(file?.buffer.toString(), true);
          result = true;

          break;
        }

        default: {
          break;
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    return result;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `Provided file failed ${file.mimetype} validation`;
  }
}
