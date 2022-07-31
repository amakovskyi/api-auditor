export const END = '\x1b[0m';
export const FG_UNDERLINE = '\x1b[4m';
export const FG_BOLD = '\x1b[1m';
export const FG_GREEN = '\x1b[32m';
export const FG_WHITE = '\x1b[37m';
export const FG_RED = '\x1b[31m';
export const FG_BLUE = '\x1b[34m';
export const BG_BLUE = '\x1b[44m';
export const FG_DIM = '\x1b[2m';
export const FG_GRAY = '\x1b[37m';
export const BG_BLACK = '\x1b[40m';

export class ConsoleLogger {

  static print(text: any) {
    process.stdout.write(text);
  }

  static println(count = 1) {
    for (let i = 0; i < count; i++) {
      process.stdout.write('\n');
    }
  }

  static log(text: any) {
    this.print(text);
    ConsoleLogger.println();
  }

}