import { Test, TestingModule } from '@nestjs/testing';
import { XmlController } from '../../../src/xml/xml.controller';
import { XmlService } from '../../../src/xml/xml.service';
import { Logger } from 'nestjs-pino';

describe('XmlController', () => {
  let controller: XmlController;

  const mockXmlService = {
    parseAsXml: jest.fn(),
  };
  
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlController],
      providers: [
        { provide: XmlService, useValue: mockXmlService },
        { provide: Logger, useValue: mockLogger }
      ],
    }).compile();

    controller = module.get<XmlController>(XmlController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /xml/to/{*format}', () => {
    it('should return success response when a valid file is uploaded and not throw', () => {
      const mockXmlFile = {
        fieldname: 'file',
        originalname: 'valid-xml-example.xml',
        encoding: '7bit',
        mimetype: 'application/xml',
        buffer: Buffer.from('<root><test>valid</test></root>'),
        size: 1024,
      } as Express.Multer.File;

      expect(controller.xmlConvertToFormat(mockXmlFile)).toEqual({
        message: 'File uploaded successfully',
      });
    });

    it('should throw an exception when parsing an invalid file', () => {
      const mockInvalidXmlFile = {
        fieldname: 'file',
        originalname: 'valid-xml-example.xml',
        encoding: '7bit',
        mimetype: 'application/xml',
        buffer: Buffer.from('<root><unclosed>'),
      } as Express.Multer.File;
      mockXmlService.parseAsXml.mockImplementation(() => { throw new Error('Failed to parse invalid xml')})
      
      expect(() => controller.xmlConvertToFormat(mockInvalidXmlFile)).toThrow();
    });
  });
});
