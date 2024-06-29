import { OutputWriter } from './OutputWriter';
import { ProcessStdoutWriter } from './ProcessStdoutWriter';
import { ConsoleLogger } from './ConsoleLogger';

export class DarkThemeConsoleLogger extends ConsoleLogger {

  private outputWriter: OutputWriter;

  constructor(outputWriter: OutputWriter = new ProcessStdoutWriter()) {
    super();
    this.outputWriter = outputWriter;
  }

  protected printFileName(value: string): void {
    this.outputWriter.write(`\x1b[1;90m>>> ${value}\x1b[0m\n`);
  }

  protected printTestName(value: string): void {
    this.outputWriter.write(`\x1b[1;90m| ${value}\x1b[0m\n`);
  }

  protected printTestDescription(value: string): void {
    this.outputWriter.write(`\x1b[90m| ${value}\x1b[0m\n`);
  }

  protected printSection(value: string): void {
    this.outputWriter.write('\n');
    this.outputWriter.write(`\x1b[1;34m${value}\x1b[0m\n`);
    this.outputWriter.write('\n');
  }

  protected printText(value: string): void {
    this.outputWriter.write(`${value}\x1b[0m\n`);
  }

  protected printTextBold(value: string): void {
    this.outputWriter.write(`\x1b[1m${value}\x1b[0m\n`);
  }

  protected printObject(value: string): void {
    this.outputWriter.write(`\x1b[48;5;235m\x1b[38;5;255m`); // set background and text color
    this.outputWriter.write(value + '\n');
    this.outputWriter.write(`\x1b[0m`); // reset formatting
    this.outputWriter.write('\n'); // print a blank line
  }

  protected printSpace(): void {
    this.outputWriter.write('\n');
  }
}