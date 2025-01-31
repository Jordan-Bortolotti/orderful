/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { TextModule } from '../../../src/text/text.module';
import { AppModule } from '../../../src/app.module';

describe('TextController (e2e)', () => {
  let app: INestApplication<AppModule>;
  const mockValidText = Buffer.from(
    'ProductID*4*8*15*16*23~\n' +
      'AddressID*42*108*3*14~\n' +
      'ContactID*59*26~',
  );
  const mockInvalidText = Buffer.from('**With*Missing*Separators');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TextModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/text/to/xml (POST)', () => {
    it('should convert valid text to XML', () => {
      return request(<App>app.getHttpServer())
        .post('/text/to/xml')
        .attach('file', mockValidText, 'data.txt')
        .expect(201)
        .expect((res) => {
          expect(res.text).toContain('<ProductID1>4</ProductID1>');
          expect(res.text).toContain('<AddressID>');
        });
    });

    it('should use custom separators from query params', () => {
      const customText = Buffer.from('ProductID#4#8#15|AddressID#42#108');
      return request(<App>app.getHttpServer())
        .post('/text/to/xml')
        .query({ line: '|', el: '#' })
        .attach('file', customText, 'custom.txt')
        .expect(201)
        .expect((res) => {
          expect(res.text).toContain('<ProductID1>4</ProductID1>');
          expect(res.text).toContain('<AddressID2>108</AddressID2>');
        });
    });

    it('should return 422 for invalid text format', () => {
      return request(<App>app.getHttpServer())
        .post('/text/to/xml')
        .attach('file', mockInvalidText, 'invalid.txt')
        .expect(422);
    });
  });

  describe('/text/to/json (POST)', () => {
    it('should convert valid text to JSON', () => {
      return request(<App>app.getHttpServer())
        .post('/text/to/json')
        .attach('file', mockValidText, 'data.txt')
        .expect(201)
        .expect(({ body }: request.Response) => {
          expect(body).toHaveProperty('ProductID');
          expect(body.ProductID).toBeInstanceOf(Array);
          expect(body.ProductID[0]).toHaveProperty('ProductID1', '4');
        });
    });

    it('should handle empty text file', () => {
      return request(<App>app.getHttpServer())
        .post('/text/to/json')
        .attach('file', Buffer.from(''), 'empty.txt')
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });

    it('should preserve numeric values as strings', () => {
      const numberText = Buffer.from('Numbers*123*45.67');
      return request(<App>app.getHttpServer())
        .post('/text/to/json')
        .attach('file', numberText, 'numbers.txt')
        .expect(201)
        .expect(({ body }: request.Response) => {
          expect(body.Numbers[0]).toEqual({
            Numbers1: '123',
            Numbers2: '45.67',
          });
        });
    });
  });

  describe('Common validation', () => {
    it('should reject non-text files', () => {
      return request(<App>app.getHttpServer())
        .post('/text/to/xml')
        .attach('file', Buffer.from('binary data'), 'data.pdf')
        .expect(422);
    });

    it('should require file upload', () => {
      return request(<App>app.getHttpServer())
        .post('/text/to/json')
        .expect(422);
    });

    it('should handle large text files', () => {
      const largeText = Buffer.from('Key*Value~\n'.repeat(10000));
      return request(<App>app.getHttpServer())
        .post('/text/to/xml')
        .attach('file', largeText, 'large.txt')
        .expect(201)
        .expect((res) => {
          expect(res.text).toContain('<Key1>Value</Key1>');
        });
    });
  });
});
