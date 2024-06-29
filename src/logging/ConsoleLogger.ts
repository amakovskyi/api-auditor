import { IntegrationTestLogger } from './IntegrationTestLogger';

export abstract class ConsoleLogger extends IntegrationTestLogger {

  fileName(value: string): void {
    this.printFileName(value);
  }

  testName(value: string): void {
    const lines = value.split('\n');
    for (const line of lines) {
      this.printTestName(line);
    }
  }

  testDescription(value: string): void {
    const lines = value.split('\n');
    while (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    const hasBlankLine = lines.some(line => line.trim() === '');
    if (hasBlankLine) {
      this.printTestDescription('');
    }
    const minIndent = Math.min(...lines.filter(line => line.trim()).map(line => line.search(/\S/)));
    for (const line of lines) {
      const trimmedLine = line.substring(minIndent);
      this.printTestDescription(trimmedLine);
    }
  }

  section(value: string): void {
    this.printSection(value);
  }

  text(value: string): void {
    this.printText(value);
  }

  textBold(value: string): void {
    this.printTextBold(value);
  }

  object(value: any): void {
    let text: string;
    if (typeof value === 'object') {
      text = JSON.stringify(value, null, 2);
    } else {
      text = String(value);
    }
    this.printObject(text);
  }

  space(): void {
    this.printSpace();
  }

  protected abstract printFileName(value: string): void;

  protected abstract printTestName(value: string): void;

  protected abstract printTestDescription(value: string): void;

  protected abstract printSection(value: string): void;

  protected abstract printText(value: string): void;

  protected abstract printTextBold(value: string): void;

  protected abstract printObject(value: string): void;

  protected abstract printSpace(): void;
}
