import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { XmlService } from './xml.service';
import { Logger } from 'nestjs-pino';
import {
  FILE_TYPES,
  ValidateFileParsing,
} from '../common/pipes/parse-file-pipe';
import { JsonService } from '../json/json.service';

@Controller('xml')
export class XmlController {
  constructor(
    private readonly xmlService: XmlService,
    private readonly jsonService: JsonService,
    private readonly logger: Logger,
  ) {}

  @Post('/to/json')
  @UseInterceptors(FileInterceptor('file'))
  convertXmlToJson(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'xml' })
        .addValidator(new ValidateFileParsing({ fileType: FILE_TYPES.XML }))
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory(error) {
            throw new UnprocessableEntityException(error);
          },
        }),
    )
    file: Express.Multer.File,
  ): Record<string, any> {
    let inputDataToTransform: Record<string, any>;
    try {
      inputDataToTransform = this.xmlService.parseToPlainObject(file);
      return this.jsonService.convertToJson(inputDataToTransform);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/to/text')
  @UseInterceptors(FileInterceptor('file'))
  convertXmlToText(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'xml' })
        .addValidator(new ValidateFileParsing({ fileType: FILE_TYPES.XML }))
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory(error) {
            throw new UnprocessableEntityException(error);
          },
        }),
    )
    file: Express.Multer.File,
  ): Record<string, any> {
    let inputDataToTransform: Record<string, any>;
    try {
      inputDataToTransform = this.xmlService.parseToPlainObject(file);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    return {
      message: 'File uploaded successfully',
      data: inputDataToTransform,
    };
  }
}
