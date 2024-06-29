import { IntegrationTestLogger } from '../../../src/logging/IntegrationTestLogger';
import { TestOutputWriter } from './TestOutputWriter';
import { LightThemeConsoleLogger } from '../../../src/logging/LightThemeConsoleLogger';

describe('DarkThemeConsoleLogger', () => {

  let outputWriter: TestOutputWriter;
  let logger: IntegrationTestLogger;

  beforeEach(() => {
    outputWriter = new TestOutputWriter();
    logger = new LightThemeConsoleLogger(outputWriter);
    process.stdout.write('NORMAL TEXT -- BEFORE\n');
    process.stdout.write('=====================\n');
  });

  afterEach(() => {
    process.stdout.write('=====================\n');
    process.stdout.write('NORMAL TEXT --- AFTER\n');
  });

  test('fileName', async () => {
    logger.fileName('TestFileName.test.ts');
    outputWriter.validate(`
            $ \x1b[1;37m>>> TestFileName.test.ts\x1b[0m\\
        `);
  });

  test('testName', async () => {
    logger.testName('Test flow');
    outputWriter.validate(`
            $ \x1b[1;37m| Test flow\x1b[0m\\
        `);
  });

  test('testDescription: no blank lines', async () => {
    logger.testDescription(`
        How the test logger works.
        How the test logger prints information.
         - Some
         - Other
         - Things
        `);
    outputWriter.validate(`
            $ \x1b[37m| How the test logger works.\x1b[0m\\
            $ \x1b[37m| How the test logger prints information.\x1b[0m\\
            $ \x1b[37m|  - Some\x1b[0m\\
            $ \x1b[37m|  - Other\x1b[0m\\
            $ \x1b[37m|  - Things\x1b[0m\\
        `);
  });

  test('testDescription: blank line inside causes force adding blank line at start', async () => {
    logger.testDescription(`
        There is a long description here the will be split into multiple lines.
        
        There is another part of description after a blank line.
         - Some
         - Other
         - Things
        `);
    outputWriter.validate(`
            $ \x1b[37m| \x1b[0m\\
            $ \x1b[37m| There is a long description here the will be split into multiple lines.\x1b[0m\\
            $ \x1b[37m| \x1b[0m\\
            $ \x1b[37m| There is another part of description after a blank line.\x1b[0m\\
            $ \x1b[37m|  - Some\x1b[0m\\
            $ \x1b[37m|  - Other\x1b[0m\\
            $ \x1b[37m|  - Things\x1b[0m\\
        `);
  });

  test('section', async () => {
    logger.section('Section 1');
    outputWriter.validate(`
            $ \\
            $ \x1b[1;32mSection 1\x1b[0m\\
            $ \\
        `);
  });

  test('text', async () => {
    logger.text('Some text');
    outputWriter.validate(`
            $ Some text\x1b[0m\\
        `);
  });

  test('space', async () => {
    logger.text('Line 1');
    logger.space();
    logger.text('Line 2');
    outputWriter.validate(`
            $ Line 1\x1b[0m\\
            $ \\
            $ Line 2\x1b[0m\\
        `);
  });

  test('textBold', async () => {
    logger.textBold('Some bold text');
    outputWriter.validate(`
            $ \x1b[1mSome bold text\x1b[0m\\
        `);
  });

  test('object: JSONObject', async () => {
    logger.object({ json: 'request', some: 'other' });
    outputWriter.validate(`
            $ \x1b[48;5;251m\x1b[38;5;0m
            $ {\\
            $   "json": "request",\\
            $   "some": "other"\\
            $ }\\
            $ \x1b[0m\\
        `);
  });

  test('object: JSONArray', async () => {
    logger.object([1, 2, 3, 4, 5]);
    outputWriter.validate(`
            $ \x1b[48;5;251m\x1b[38;5;0m
            $ [\\
            $   1,\\
            $   2,\\
            $   3,\\
            $   4,\\
            $   5\\
            $ ]\\
            $ \x1b[0m\\
        `);
  });

  test('object: string', async () => {
    logger.object('string object');
    outputWriter.validate(`
            $ \x1b[48;5;251m\x1b[38;5;0m
            $ string object\\
            $ \x1b[0m\\
        `);
  });

  test('object: 123', async () => {
    logger.object(123);
    outputWriter.validate(`
            $ \x1b[48;5;251m\x1b[38;5;0m
            $ 123\\
            $ \x1b[0m\\
        `);
  });

  test('object: null', async () => {
    logger.object(null);
    outputWriter.validate(`
            $ \x1b[48;5;251m\x1b[38;5;0m
            $ null\\
            $ \x1b[0m\\
        `);
  });

  test('object: undefined', async () => {
    logger.object(undefined);
    outputWriter.validate(`
            $ \x1b[48;5;251m\x1b[38;5;0m
            $ undefined\\
            $ \x1b[0m\\
        `);
  });

});