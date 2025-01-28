import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { XmlController } from '../../../src/xml/xml.controller';
import { XmlService } from '../../../src/xml/xml.service';
import { Logger } from 'nestjs-pino';

describe('XmlController', () => {
  let controller: XmlController;
  let xmlService: XmlService;
  let logger: Logger;

  const mockXmlService = {
    getHello: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlController],
      providers: [
        { provide: XmlService, useValue: mockXmlService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<XmlController>(XmlController);
    xmlService = module.get<XmlService>(XmlService);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return the hello message from the service', () => {
      const expectedMessage = 'Hello from XML Service!';
      mockXmlService.getHello.mockReturnValue(expectedMessage);

      const result = controller.sayHello();

      expect(result).toBe(expectedMessage);
      expect(xmlService.getHello).toHaveBeenCalled();
    });
  });

  describe('POST /upload', () => {
    it('should return success response when a valid file is uploaded', () => {
      const mockFile = {
        filename: 'test.xml_1234.xml',
        originalname: 'test.xml',
        mimetype: 'application/xml',
        size: 1024,
        path: '/uploads/test.xml_1234.xml',
      } as Express.Multer.File;

      expect(controller.uploadFile(mockFile)).toEqual({
        message: 'File uploaded successfully',
        filename: mockFile.filename,
        path: `/uploads/${mockFile.filename}`,
      });
    });
    
    it('should throw BadRequestException when an invalid file is uploaded', () => {
      expect(() => controller.uploadFile(<any>undefined)).toThrow(
        BadRequestException,
      );
    });
  });
});