import { XmlService } from '../../../src/xml/xml.service';
import { Logger } from 'nestjs-pino';

describe('XmlService', () => {
  let sut: XmlService;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    sut = new XmlService(mockLogger as unknown as Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseToPlainObject', () => {
    it('should return a parsed JSON when given a valid xml file', () => {
      const mockXmlFile = {
        fieldname: 'file',
        originalname: 'valid-xml-example.xml',
        encoding: '7bit',
        mimetype: 'application/xml',
        buffer: Buffer.from('<root><test>valid</test></root>'),
        size: 1024,
      } as Express.Multer.File;

      expect(sut.parseToPlainObject(mockXmlFile)).toEqual({
        test: 'valid',
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
      expect(() => sut.parseToPlainObject(mockInvalidXmlFile)).toThrow();
    });
  });

  describe('convertToXml', () => {
    it('should return success response when a valid file is uploaded and not throw', () => {
      const mockJsonObject = {
        test: 'valid',
      };
      const prependXmlVersionTag = '<?xml version="1.0" encoding="UTF-8"?>\n';

      expect(sut.convertToXml(mockJsonObject)).toEqual(
        prependXmlVersionTag + '<root>\n    <test>valid</test>\n</root>',
      );
    });

    it('should return an xml string with an empty root when converting to XML from an empty object', () => {
      const mockEmptyObject = {};

      expect(sut.convertToXml(mockEmptyObject)).toEqual(
        `<?xml version="1.0" encoding="UTF-8"?>\n<root/>`,
      );
    });
  });
});
