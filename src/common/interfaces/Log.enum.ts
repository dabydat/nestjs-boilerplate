export enum LogColorsEnum {
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  pink = '\x1b[38;5;206m',
  close = '\x1b[0m',
}

export enum LogLevelEnum {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  FATAL = 'fatal',
  TRACE = 'trace'
}

export interface ILogMetadata {
  clientIp: string;
  controller: string;
  method: string;
  url: string;
  miliseconds: string;
}