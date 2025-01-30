import {
  Controller,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { XmlService } from './xml.service';
import { Logger } from 'nestjs-pino';
import { FILE_TYPES, ValidateFileParsing } from '../common/pipes/parse-file-pipe';

@Controller()
export class XmlController {
  constructor(
    private readonly xmlService: XmlService,
    private readonly logger: Logger
  ) {}


  @Post('xml/to/{*format}')
  @UseInterceptors(
    FileInterceptor('file')
  )
  xmlConvertToFormat(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator(
        { fileType: 'xml' },
      )
      .addValidator(
        new ValidateFileParsing(
          { fileType: FILE_TYPES.XML }
        ),
      )
      .build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory(error) {
          throw new UnprocessableEntityException(error);
        },
      }),
  ) file: Express.Multer.File) {
    try {
      this.xmlService.parseAsXml(file);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    return {
      message: 'File uploaded successfully',
    };
  }
}
