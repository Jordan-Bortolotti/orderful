import { Injectable, FileValidator } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

export enum FILE_TYPES {
  XML = 'xml',
}

export interface IFileTypeOptions {
  fileType: FILE_TYPES;
}

@Injectable()
export class ValidateXmlFileParsing extends FileValidator {
  protected validationOptions: { acceptedFileType: FILE_TYPES };

  constructor(options: IFileTypeOptions) {
    super(options);
    this.validationOptions.acceptedFileType = options.fileType;
  }

  isValid(file: Express.Multer.File): boolean {
    try {
      const parser = new XMLParser();
      // throws error if xml parsing fails
      parser.parse(file?.buffer.toString(), true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `Provided file failed ${file.mimetype} validation`;
  }
}
