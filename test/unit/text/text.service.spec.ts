import { Logger } from 'nestjs-pino';
import { TextService } from '../../../src/text/text.service';

describe('TextService', () => {
  let sut: TextService;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    sut = new TextService(mockLogger as unknown as Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseToPlainObject', () => {
    it('should parse file content into object', () => {
      const mockFile = {
        buffer: Buffer.from(
          'ProductID*4*8*15*16*23~\nProductID*a*b*c*d*e~\nAddressID*42*108*3*14~\nContactID*59*26~',
        ),
      } as Express.Multer.File;

      const expected = {
        ProductID: [
          {
            ProductID1: '4',
            ProductID2: '8',
            ProductID3: '15',
            ProductID4: '16',
            ProductID5: '23',
          },
          {
            ProductID1: 'a',
            ProductID2: 'b',
            ProductID3: 'c',
            ProductID4: 'd',
            ProductID5: 'e',
          },
        ],
        AddressID: [
          {
            AddressID1: '42',
            AddressID2: '108',
            AddressID3: '3',
            AddressID4: '14',
          },
        ],
        ContactID: [
          {
            ContactID1: '59',
            ContactID2: '26',
          },
        ],
      };

      const result = sut.parseToPlainObject(mockFile, '~', '*');
      expect(result).toEqual(expected);
    });

    it('should handle empty file', () => {
      const mockFile = {
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      const result = sut.parseToPlainObject(mockFile, '~', '*');
      expect(result).toEqual({});
    });

    it('should handle file with empty lines', () => {
      const mockFile = {
        buffer: Buffer.from('\n\nProductID*4*8\n\n\nAddressID*42\n\n'),
      } as Express.Multer.File;

      const expected = {
        ProductID: [
          {
            ProductID1: '4',
            ProductID2: '8',
          },
        ],
        AddressID: [
          {
            AddressID1: '42',
          },
        ],
      };

      const result = sut.parseToPlainObject(mockFile, '\n', '*');
      expect(result).toEqual(expected);
    });

    it('should handle lines without values', () => {
      const mockFile = {
        buffer: Buffer.from('ProductID~\nAddressID*~\nContactID'),
      } as Express.Multer.File;

      const expected = {
        ProductID: [{}],
        AddressID: [{}],
        ContactID: [{}],
      };

      const result = sut.parseToPlainObject(mockFile, '~', '*');
      expect(result).toEqual(expected);
    });

    it('should handle different separators', () => {
      const mockFile = {
        buffer: Buffer.from('ProductID,4,8|AddressID,42|ContactID,59'),
      } as Express.Multer.File;

      const expected = {
        ProductID: [
          {
            ProductID1: '4',
            ProductID2: '8',
          },
        ],
        AddressID: [
          {
            AddressID1: '42',
          },
        ],
        ContactID: [
          {
            ContactID1: '59',
          },
        ],
      };

      const result = sut.parseToPlainObject(mockFile, '|', ',');
      expect(result).toEqual(expected);
    });
  });

  describe('convertToText', () => {
    it('should return a string when a valid object is passed', () => {
      const mockInput = {
        ProductID: [
          {
            ProductID1: '4',
            ProductID2: '8',
            ProductID3: '15',
            ProductID4: '16',
            ProductID5: '23',
          },
          {
            ProductID1: 'a',
            ProductID2: 'b',
            ProductID3: 'c',
            ProductID4: 'd',
            ProductID5: 'e',
          },
        ],
        AddressID: [
          {
            AddressID1: '42',
            AddressID2: '108',
            AddressID3: '3',
            AddressID4: '14',
          },
        ],
        ContactID: [
          {
            ContactID1: '59',
            ContactID2: '26',
          },
        ],
      };
      const lineSeparator = '~';
      const elementSeparator = '*';
      const expected =
        'ProductID*4*8*15*16*23~\nProductID*a*b*c*d*e~\nAddressID*42*108*3*14~\nContactID*59*26~';
      expect(
        sut.convertToText(mockInput, lineSeparator, elementSeparator),
      ).toEqual(expected);
    });

    it('should handle empty object', () => {
      const mockInput = {};
      const lineSeparator = '~';
      const elementSeparator = '*';
      const expected = '';
      expect(
        sut.convertToText(mockInput, lineSeparator, elementSeparator),
      ).toEqual(expected);
    });

    it('should handle object with empty arrays', () => {
      const mockInput = {
        ProductID: [],
        AddressID: [],
        ContactID: [],
      };
      const lineSeparator = '~';
      const elementSeparator = '*';
      const expected = '';
      expect(
        sut.convertToText(mockInput, lineSeparator, elementSeparator),
      ).toEqual(expected);
    });

    it('should handle object with single element arrays', () => {
      const mockInput = {
        ProductID: [['4']],
        AddressID: [['42']],
        ContactID: [['59']],
      };
      const lineSeparator = '~';
      const elementSeparator = '*';
      const expected = 'ProductID*4~\nAddressID*42~\nContactID*59~';
      expect(
        sut.convertToText(mockInput, lineSeparator, elementSeparator),
      ).toEqual(expected);
    });

    it('should handle mixed array and non-array values', () => {
      const mockInput = {
        ProductID: [['4', '8']],
        AddressID: '42',
        ContactID: [{ id: '59', type: 'primary' }],
      };
      const lineSeparator = '~';
      const elementSeparator = '*';
      const expected = 'ProductID*4*8~\nAddressID*42~\nContactID*59*primary~';
      expect(
        sut.convertToText(mockInput, lineSeparator, elementSeparator),
      ).toEqual(expected);
    });

    it('should handle different separators', () => {
      const mockInput = {
        ProductID: ['4', '8'],
        AddressID: '42',
      };
      const lineSeparator = '|';
      const elementSeparator = ',';
      const expected = 'ProductID,4|\nProductID,8|\nAddressID,42|';
      expect(
        sut.convertToText(mockInput, lineSeparator, elementSeparator),
      ).toEqual(expected);
    });
  });
});
