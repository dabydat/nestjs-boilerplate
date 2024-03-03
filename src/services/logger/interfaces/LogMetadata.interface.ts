export interface RequestData {
  controller?: string;
  method?: string;
  miliseconds?: string;
}

export interface ErrorData {
  statusCode?: number;
  message?: string;
  stackTrace?: string;
  timestamp?: string;
  validationError?: string[];
}

export interface LogMetadata extends RequestData, ErrorData {
  clientIp?: string;
  url?: string;
}
