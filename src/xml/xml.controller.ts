import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { XmlService } from './xml.service';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Logger } from 'nestjs-pino';

@Controller()
export class XmlController {
  constructor(
    private readonly xmlService: XmlService,
    private readonly logger: Logger,
  ) {}

  @Get()
  sayHello() {
    return this.xmlService.getHello();
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${file.originalname}_${randomUUID()}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueName}${ext}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(xml)$/)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Unsupported file type'), false);
        }
      },
    }),
  )
  @Post('upload')
  uploadFile(@UploadedFile() file: Express.Multer.File | null) {
    this.logger.log('Uploaded File: ', JSON.stringify(file));
    if (!file) {
      throw new BadRequestException('File upload failed');
    }
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}
