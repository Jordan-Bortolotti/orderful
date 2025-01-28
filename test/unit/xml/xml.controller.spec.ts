import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { XmlController } from '../../../src/xml/xml.controller';
import { XmlService } from '../../../src/xml/xml.service';

describe('XmlController', () => {
  let controller: XmlController;

  const mockXmlService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlController],
      providers: [{ provide: XmlService, useValue: mockXmlService }],
    }).compile();

    controller = module.get<XmlController>(XmlController);
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
      expect(mockXmlService.getHello).toHaveBeenCalled();
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
      expect(() => controller.uploadFile(null)).toThrow(BadRequestException);
    });
  });
});
