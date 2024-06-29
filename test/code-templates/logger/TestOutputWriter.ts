import { OutputWriter } from '../../../src/logging/OutputWriter';

function replaceAll(input: String, searchValue: string, replaceValue: string): string {
  return input.split(searchValue).join(replaceValue);
}

export class TestOutputWriter implements OutputWriter {
  private buffer: string = '';

  write(output: string): void {
    this.buffer += output;
    process.stdout.write(output);
  }

  /**
   * For convenience of logging [expectedSpec] is transformed
   * @param expectedSpec
   */
  validate(expectedSpec: string): void {
    let expected = expectedSpec.split('\n')
      .filter((line) => line.trimStart().startsWith('$ ')) // "$ " is a start of line expected to be in logging
      .map((line) => line.trimStart().substring(2))
      .map((line) => replaceAll(line, '\\', '\n')) // format new line symbols
      .join('');
    expect(this.buffer).toEqual(expected);
  }

}