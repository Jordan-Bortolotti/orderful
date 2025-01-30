import { Injectable, FileValidator, Inject } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

export enum FILE_TYPES {
  XML = 'xml',
  JSON = 'json',
  TEXT = 'text'
}

export interface IFileTypeOptions {
  fileType: FILE_TYPES;
}

@Injectable()
export class ValidateFileParsing extends FileValidator {
  protected validationOptions: { acceptedFileType: string };
  

  constructor(
    options: IFileTypeOptions,
  ) {
    super(options);
    this.validationOptions.acceptedFileType = options.fileType;
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    let result = false;
    try {
      switch (this.validationOptions.acceptedFileType) {
        case (FILE_TYPES.JSON):
          // parse JSON
        case (FILE_TYPES.TEXT):
          // parse text
        case (FILE_TYPES.XML):
          // parse XML
          const parser = new XMLParser();
          parser.parse(file?.buffer.toString(), true); // throws error if xml validation fails
          result = true;
          break;
        default:
          break;
      }
    } catch (error) {
      return false;
    }
    return result;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `Provided file failed ${file.mimetype} validation`;
  }
}