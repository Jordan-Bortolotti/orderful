import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { XmlService } from './xml.service';
import { SampleDto } from '../formats/sample.dto';
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
          const uniqueName = `${file.originalname}_${randomUUID()}`; // Generate unique filename
          const ext = extname(file.originalname); // Get file extension
          callback(null, `${uniqueName}${ext}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        // Allow only images and PDFs
        if (file.mimetype.match(/\/(xml|text|txt|json)$/)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Unsupported file type'), false);
        }
      },
    }),
  )
  @Post('upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.logger.log('\nUploaded File: ', file);
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
