import { JsonService } from '../../../src/json/json.service';
import { Logger } from 'nestjs-pino';

describe('JsonService', () => {
  let sut: JsonService;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(() => {
    sut = new JsonService(mockLogger as unknown as Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseToPlainObject', () => {
    it('should return a parsed JSON when given a valid JSON file', () => {
      const mockJsonFile = {
        fieldname: 'file',
        originalname: 'valid-json-example.json',
        encoding: '7bit',
        mimetype: 'application/json',
        buffer: Buffer.from('{"test": 1}'),
        size: 1024,
      } as Express.Multer.File;

      expect(sut.parseToPlainObject(mockJsonFile)).toEqual({
        test: 1,
      });
    });

    it('should throw an exception when parsing an invalid file', () => {
      const mockInvalidJsonFile = {
        fieldname: 'file',
        originalname: 'valid-json-example.json',
        encoding: '7bit',
        mimetype: 'application/json',
        buffer: Buffer.from('<test>invalid</test>'),
      } as Express.Multer.File;
      expect(() => sut.parseToPlainObject(mockInvalidJsonFile)).toThrow();
    });
  });

  describe('convertToJson', () => {
    it('should return success response when a valid file is uploaded and not throw', () => {
      const mockJsonObject = {
        test: 'valid',
      };

      expect(sut.convertToJson(mockJsonObject)).toEqual(mockJsonObject);
    });

    it('should return an empty JSON object when given an empty object', () => {
      const mockEmptyObject = {};

      expect(sut.convertToJson(mockEmptyObject)).toEqual({});
    });
  });
});
