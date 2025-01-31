import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { XmlService } from './xml.service';
import { JsonService } from '../json/json.service';
import { TextService } from '../text/text.service';
import {
  FILE_TYPES,
  ValidateXmlFileParsing,
} from './pipes/parse-xml-file.pipe';

@Controller('xml')
export class XmlController {
  constructor(
    private readonly xmlService: XmlService,
    private readonly jsonService: JsonService,
    private readonly textService: TextService,
    private readonly logger: Logger,
  ) {}

  @Post('/to/json')
  @UseInterceptors(FileInterceptor('file'))
  convertXmlToJson(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'xml' })
        .addValidator(new ValidateXmlFileParsing({ fileType: FILE_TYPES.XML }))
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
        .addValidator(new ValidateXmlFileParsing({ fileType: FILE_TYPES.XML }))
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory(error) {
            throw new UnprocessableEntityException(error);
          },
        }),
    )
    file: Express.Multer.File,
    @Query('line') line: string,
    @Query('el') el: string,
  ): string {
    let inputDataToTransform: Record<string, any>;
    const lineSeparator = typeof line === 'string' ? line : '~';
    const elementSeparator = typeof el === 'string' ? el : '*';
    try {
      inputDataToTransform = this.xmlService.parseToPlainObject(file);
      return this.textService.convertToText(
        inputDataToTransform,
        lineSeparator,
        elementSeparator,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
