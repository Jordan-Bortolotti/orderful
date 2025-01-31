import { Test, TestingModule } from '@nestjs/testing';
import { XmlController } from '../../../src/xml/xml.controller';
import { XmlService } from '../../../src/xml/xml.service';
import { JsonService } from '../../../src/json/json.service';
import { TextService } from '../../../src/text/text.service';
import { Logger } from 'nestjs-pino';

describe('XmlController', () => {
  let controller: XmlController;

  const mockXmlService = {
    parseToPlainObject: jest.fn(),
  };

  const mockJsonService = {
    convertToJson: jest.fn(),
  };

  const mockTextService = {
    convertToText: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlController],
      providers: [
        { provide: XmlService, useValue: mockXmlService },
        { provide: JsonService, useValue: mockJsonService },
        { provide: TextService, useValue: mockTextService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<XmlController>(XmlController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /xml/to/json', () => {
    it('should return success response when a valid file is uploaded and not throw', () => {
      const mockXmlFile = {
        fieldname: 'file',
        originalname: 'valid-xml-example.xml',
        encoding: '7bit',
        mimetype: 'application/xml',
        buffer: Buffer.from('<root><test>valid</test></root>'),
        size: 1024,
      } as Express.Multer.File;
      const mockJsonObject = { test: 'valid' };
      mockJsonService.convertToJson.mockReturnValue(mockJsonObject);

      expect(controller.convertXmlToJson(mockXmlFile)).toEqual(mockJsonObject);
    });

    it('should throw an exception when parsing an invalid file', () => {
      const mockInvalidXmlFile = {
        fieldname: 'file',
        originalname: 'valid-xml-example.xml',
        encoding: '7bit',
        mimetype: 'application/xml',
        buffer: Buffer.from('<root><unclosed>'),
      } as Express.Multer.File;
      mockXmlService.parseToPlainObject.mockImplementation(() => {
        throw new Error('Failed to parse invalid xml');
      });

      expect(() => controller.convertXmlToJson(mockInvalidXmlFile)).toThrow();
    });

    describe('POST /xml/to/text', () => {
      it('should convert xml to text with custom separators when query params provided', () => {
        const mockXmlFile = {
          fieldname: 'file',
          originalname: 'valid-xml-example.xml',
          encoding: '7bit',
          mimetype: 'application/xml',
          buffer: Buffer.from('<root><test>valid</test></root>'),
          size: 1024,
        } as Express.Multer.File;

        const expectedText = 'test|valid\n';
        mockXmlService.parseToPlainObject.mockReturnValue({ test: 'valid' });
        mockTextService.convertToText.mockReturnValue(expectedText);

        const result = controller.convertXmlToText(mockXmlFile, '+', '|');

        expect(mockTextService.convertToText).toHaveBeenCalledWith(
          { test: 'valid' },
          '+',
          '|',
        );
        expect(result).toBe(expectedText);
      });

      it('should throw and log error when xml parsing fails', () => {
        const mockXmlFile = {
          fieldname: 'file',
          originalname: 'invalid-xml.xml',
          encoding: '7bit',
          mimetype: 'application/xml',
          buffer: Buffer.from('<root><unclosed>'),
          size: 1024,
        } as Express.Multer.File;

        const error = new Error('Failed to parse XML');
        mockXmlService.parseToPlainObject.mockImplementation(() => {
          throw error;
        });

        expect(() =>
          controller.convertXmlToText(mockXmlFile, '~', '*'),
        ).toThrow(error);
        expect(mockLogger.error).toHaveBeenCalledWith(error);
      });
    });
  });
});
