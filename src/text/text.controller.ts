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
import { TextService } from './text.service';
import { Logger } from 'nestjs-pino';
import { XmlService } from '../xml/xml.service';
import {
  ValidateTextFileParsing,
  FILE_TYPES,
} from 'src/text/pipes/parse-text-file.pipe';
import { JsonService } from 'src/json/json.service';

@Controller('text')
export class TextController {
  constructor(
    private readonly textService: TextService,
    private readonly xmlService: XmlService,
    private readonly jsonService: JsonService,
    private readonly logger: Logger,
  ) {}

  @Post('/to/xml')
  @UseInterceptors(FileInterceptor('file'))
  convertTextToXml(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'text/plain' })
        .addValidator(
          new ValidateTextFileParsing({ fileType: FILE_TYPES.TEXT }),
        )
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
      inputDataToTransform = this.textService.parseToPlainObject(
        file,
        lineSeparator,
        elementSeparator,
      );
      return this.xmlService.convertToXml(inputDataToTransform);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/to/json')
  @UseInterceptors(FileInterceptor('file'))
  convertTextToText(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'text/plain' })
        .addValidator(
          new ValidateTextFileParsing({ fileType: FILE_TYPES.TEXT }),
        )
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
  ) {
    let inputDataToTransform: Record<string, any>;
    try {
      const lineSeparator = typeof line === 'string' ? line : '~';
      const elementSeparator = typeof el === 'string' ? el : '*';
      inputDataToTransform = this.textService.parseToPlainObject(
        file,
        lineSeparator,
        elementSeparator,
      );
      return this.jsonService.convertToJson(inputDataToTransform);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
