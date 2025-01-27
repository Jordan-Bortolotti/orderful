import { Test, TestingModule } from '@nestjs/testing';
import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';
import { LoggerModule } from 'nestjs-pino';

describe('XmlController', () => {
  let xmlController: XmlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [XmlController],
      providers: [XmlService],
    }).compile();

    xmlController = app.get<XmlController>(XmlController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(xmlController.sayHello()).toBe('Hello World!');
    });
  });
});
