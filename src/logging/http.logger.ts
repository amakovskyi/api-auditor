import { BG_BLACK, ConsoleLogger, END, FG_BOLD, FG_RED, FG_WHITE } from './console.logger';

export class HttpLogger {

  static logMethodUrl(method: string, url: string) {
    ConsoleLogger.print(FG_BOLD + method + ': ' + url + END + '\n');
  }

  static logBody(body: string, flavour: 'success' | 'failure' = 'success') {
    let value = body;
    if (value.length > 32768) {
      value = value.substring(0, 32768);
    }
    if (flavour == 'success') {
      ConsoleLogger.print(FG_WHITE + BG_BLACK + value + '\n' + END);
    } else {
      ConsoleLogger.print(FG_RED + BG_BLACK + value + '\n' + END);
    }
  }

  static logResponseStatus(code: number, message: string, flavour: 'success' | 'failure' = 'success') {
    if (flavour == 'success') {
      ConsoleLogger.print(code + ': ' + message + '\n');
    } else {
      ConsoleLogger.print(FG_RED + code + ': ' + message + END + '\n');
    }
  }

}