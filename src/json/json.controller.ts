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
import { JsonService } from './json.service';
import { Logger } from 'nestjs-pino';
import { XmlService } from '../xml/xml.service';
import { TextService } from '../text/text.service';
import {
  ValidateJsonFileParsing,
  FILE_TYPES,
} from './pipes/parse-json-file.pipe';

@Controller('json')
export class JsonController {
  constructor(
    private readonly jsonService: JsonService,
    private readonly xmlService: XmlService,
    private readonly textService: TextService,
    private readonly logger: Logger,
  ) {}

  @Post('/to/xml')
  @UseInterceptors(FileInterceptor('file'))
  convertJsonToXml(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'application/json' })
        .addValidator(
          new ValidateJsonFileParsing({ fileType: FILE_TYPES.JSON }),
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
  ): string {
    let inputDataToTransform: Record<string, any>;
    try {
      inputDataToTransform = this.jsonService.parseToPlainObject(file);
      return this.xmlService.convertToXml(inputDataToTransform);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/to/text')
  @UseInterceptors(FileInterceptor('file'))
  convertJsonToText(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'json' })
        .addValidator(
          new ValidateJsonFileParsing({ fileType: FILE_TYPES.JSON }),
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
      inputDataToTransform = this.jsonService.parseToPlainObject(file);
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
