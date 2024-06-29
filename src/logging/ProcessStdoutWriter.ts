import { OutputWriter } from './OutputWriter';

export class ProcessStdoutWriter implements OutputWriter {
  write(output: string): void {
    process.stdout.write(output);
  }
}