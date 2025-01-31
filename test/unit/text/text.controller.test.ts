import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from '../../../src/text/text.controller';
import { TextService } from '../../../src/text/text.service';
import { XmlService } from '../../../src/xml/xml.service';
import { JsonService } from '../../../src/json/json.service';
import { Logger } from 'nestjs-pino';

describe('TextController', () => {
  let controller: TextController;

  const mockJsonService = {
    convertToJson: jest.fn(),
  };

  const mockXmlService = {
    convertToXml: jest.fn(),
  };

  const mockTextService = {
    parseToPlainObject: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  };

  const mockFile = {
    fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    buffer: Buffer.from('test*data~'),
    size: 9,
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [
        {
          provide: TextService,
          useValue: mockTextService,
        },
        {
          provide: XmlService,
          useValue: mockXmlService,
        },
        {
          provide: JsonService,
          useValue: mockJsonService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<TextController>(TextController);
  });

  describe('convertTextToXml', () => {
    it('should convert text to XML successfully', () => {
      const mockPlainObject = { test: 'data' };
      const mockXml = '<test>data</test>';

      jest
        .spyOn(mockTextService, 'parseToPlainObject')
        .mockReturnValue(mockPlainObject);
      jest.spyOn(mockXmlService, 'convertToXml').mockReturnValue(mockXml);

      const result = controller.convertTextToXml(mockFile, '~', '*');

      expect(mockTextService.parseToPlainObject).toHaveBeenCalledWith(
        mockFile,
        '~',
        '*',
      );
      expect(mockXmlService.convertToXml).toHaveBeenCalledWith(mockPlainObject);
      expect(result).toBe(mockXml);
    });

    it('should handle errors during XML conversion', () => {
      const error = new Error('Conversion failed');
      jest
        .spyOn(mockTextService, 'parseToPlainObject')
        .mockImplementation(() => {
          throw error;
        });
      jest.spyOn(mockLogger, 'error');

      expect(() => controller.convertTextToXml(mockFile, '~', '*')).toThrow(
        error,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('convertTextToJson', () => {
    it('should convert text to JSON successfully', () => {
      const mockPlainObject = { test: 'data' };
      const mockJson = '{"test":"data"}';

      jest
        .spyOn(mockTextService, 'parseToPlainObject')
        .mockReturnValue(mockPlainObject);
      jest.spyOn(mockJsonService, 'convertToJson').mockReturnValue(mockJson);

      const result = controller.convertTextToText(mockFile, '~', '*');

      expect(mockTextService.parseToPlainObject).toHaveBeenCalledWith(
        mockFile,
        '~',
        '*',
      );
      expect(mockJsonService.convertToJson).toHaveBeenCalledWith(
        mockPlainObject,
      );
      expect(result).toBe(mockJson);
    });

    it('should handle errors during JSON conversion', () => {
      const error = new Error('Conversion failed');
      jest
        .spyOn(mockTextService, 'parseToPlainObject')
        .mockImplementation(() => {
          throw error;
        });
      jest.spyOn(mockLogger, 'error');

      expect(() => controller.convertTextToText(mockFile, '~', '*')).toThrow(
        error,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });
});
