import { Test, TestingModule } from '@nestjs/testing';
import { JsonController } from '../../../src/json/json.controller';
import { JsonService } from '../../../src/json/json.service';
import { XmlService } from '../../../src/xml/xml.service';
import { Logger } from 'nestjs-pino';

describe('JsonController', () => {
  let controller: JsonController;

  const mockJsonService = {
    parseToPlainObject: jest.fn(),
  };

  const mockXmlService = {
    convertToXml: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonController],
      providers: [
        { provide: JsonService, useValue: mockJsonService },
        { provide: XmlService, useValue: mockXmlService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<JsonController>(JsonController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /json/to/xml', () => {
    it('should return success response when a valid file is uploaded and not throw', () => {
      const mockJsonFile = {
        fieldname: 'file',
        originalname: 'valid-json-example.json',
        encoding: '7bit',
        mimetype: 'application/json',
        buffer: Buffer.from('{ "test": "valid" }'),
        size: 1024,
      } as Express.Multer.File;
      const mockXmlResponse = '<root><test>valid</test></root>';
      mockXmlService.convertToXml.mockReturnValue(mockXmlResponse);

      expect(controller.convertJsonToXml(mockJsonFile)).toEqual(
        mockXmlResponse,
      );
    });

    it('should throw an exception when parsing an invalid file', () => {
      const mockInvalidJsonFile = {
        fieldname: 'file',
        originalname: 'valid-json-example.json',
        encoding: '7bit',
        mimetype: 'application/json',
        buffer: Buffer.from('<root><unclosed>'),
      } as Express.Multer.File;
      mockJsonService.parseToPlainObject.mockImplementation(() => {
        throw new Error('Failed to parse invalid json');
      });

      expect(() => controller.convertJsonToXml(mockInvalidJsonFile)).toThrow();
    });
  });
});
