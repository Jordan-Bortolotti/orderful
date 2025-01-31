import { Injectable, FileValidator } from '@nestjs/common';

export enum FILE_TYPES {
  TEXT = 'text',
}

export interface IFileTypeOptions {
  fileType: FILE_TYPES;
}

@Injectable()
export class ValidateTextFileParsing extends FileValidator {
  protected validationOptions: { acceptedFileType: FILE_TYPES };

  constructor(options: IFileTypeOptions) {
    super(options);
    this.validationOptions.acceptedFileType = options.fileType;
  }

  isValid(file: Express.Multer.File): boolean {
    try {
      return this.validateInputFileWithSeparators(
        file?.buffer.toString(),
        '~',
        '*',
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `Provided file failed ${file.mimetype} validation`;
  }

  validateInputFileWithSeparators(
    input: string,
    lineSeparator: string,
    elementSeparator: string,
  ): boolean {
    const lines = input.split(lineSeparator);

    for (const line of lines) {
      if (line.length < 1) continue;

      const elements = line.split(elementSeparator);
      const [key] = elements;

      if (!key?.length) return false;
    }

    return true;
  }
}
