import { Injectable, FileValidator } from '@nestjs/common';

export enum FILE_TYPES {
  JSON = 'json',
}

export interface IFileTypeOptions {
  fileType: FILE_TYPES;
}

@Injectable()
export class ValidateJsonFileParsing extends FileValidator {
  protected validationOptions: { acceptedFileType: FILE_TYPES };

  constructor(options: IFileTypeOptions) {
    super(options);
    this.validationOptions.acceptedFileType = options.fileType;
  }

  isValid(file: Express.Multer.File): boolean {
    try {
        // throws error if json parsing fails
        JSON.parse(file?.buffer.toString());
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
