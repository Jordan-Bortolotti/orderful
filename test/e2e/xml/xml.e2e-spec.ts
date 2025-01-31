/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { XmlModule } from '../../../src/xml/xml.module';
import { AppModule } from '../../../src/app.module';
import { App } from 'supertest/types';

describe('XmlController (e2e)', () => {
  let app: INestApplication<AppModule>;
  const mockValidXml = Buffer.from(`
    <root>
      <ProductID>
        <ProductID1>4</ProductID1>
        <ProductID2>8</ProductID2>
      </ProductID>
    </root>
  `);
  const mockInvalidXml = Buffer.from('<root><unclosed>');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [XmlModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/xml/to/json (POST)', () => {
    it('should convert valid XML to JSON', () => {
      return request(<App>app.getHttpServer())
        .post('/xml/to/json')
        .attach('file', mockValidXml, 'data.xml')
        .expect(201)
        .expect(({ body }: request.Response) => {
          expect(body)?.toHaveProperty('ProductID');
          expect(body?.ProductID).toEqual({
            ProductID1: 4,
            ProductID2: 8,
          });
        });
    });

    it('should return 422 for invalid XML format', () => {
      return request(<App>app.getHttpServer())
        .post('/xml/to/json')
        .attach('file', mockInvalidXml, 'invalid.xml')
        .expect(422);
    });

    it('should return 422 for non-XML files', () => {
      return request(<App>app.getHttpServer())
        .post('/xml/to/json')
        .attach('file', Buffer.from('not xml'), 'text.txt')
        .expect(422);
    });
  });

  describe('/xml/to/text (POST)', () => {
    it('should convert XML to text with default separators', () => {
      return request(<App>app.getHttpServer())
        .post('/xml/to/text')
        .attach('file', mockValidXml, 'data.xml')
        .expect(201)
        .expect(({ text }: request.Response) => {
          expect(text).toMatch(/ProductID\*4\*8/);
          expect(text).toContain('~');
        });
    });

    it('should use custom separators from query params', () => {
      return request(<App>app.getHttpServer())
        .post('/xml/to/text')
        .query({ line: '#', el: '|' })
        .attach('file', mockValidXml, 'data.xml')
        .expect(201)
        .expect(({ text }: request.Response) => {
          expect(text).toMatch(/ProductID\|4\|8/);
          expect(text).toContain('#');
        });
    });

    it('should handle empty XML gracefully', () => {
      const emptyXml = Buffer.from('<root></root>');
      return request(<App>app.getHttpServer())
        .post('/xml/to/text')
        .attach('file', emptyXml, 'empty.xml')
        .expect(201)
        .expect(({ text }: request.Response) => {
          expect(text).toBe('');
        });
    });
  });

  describe('Common validation', () => {
    it('should return 422 when no file is uploaded', () => {
      return request(<App>app.getHttpServer())
        .post('/xml/to/json')
        .expect(422);
    });

    it('should handle large XML files within limits', () => {
      const largeXml = Buffer.from(
        `<root>${'<data>test</data>'.repeat(10000)}</root>`,
      );
      return request(<App>app.getHttpServer())
        .post('/xml/to/text')
        .attach('file', largeXml, 'large.xml')
        .expect(201);
    });
  });
});
