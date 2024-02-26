import { appendFile, writeFile, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { LogColorsEnum, LogLevelEnum, ILogMetadata } from '../interfaces/Log.enum';

@Injectable()
export class CustomLogger {
    private logFilePath: string;
    private auditFilePath: string;

    private logDir: string = './logs';
    private logFileName: string = 'log';

    private auditDir: string = './audits';
    private auditFileName: string = 'audit';

    constructor() {
        this.logFilePath = join(this.logDir, `${this.logFileName}-${this.getCurrentDate()}.log`);
        this.auditFilePath = join(this.auditDir, `${this.auditFileName}-${this.getCurrentDate()}.json`);
    }

    /**
     * Logs an error message with the given metadata and context.
     *
     * @param {ILogMetadata} metadata - the metadata for the error log
     * @param {any} context - optional context for the error log
     * @return {void} 
     */
    public error(metadata: ILogMetadata, context?: any): void {
        this.log(LogLevelEnum.ERROR, metadata, context);
    }

    /**
     * Warns about the log with the given metadata and context.
     *
     * @param {ILogMetadata} metadata - the metadata for the log
     * @param {any} context - the context for the log
     * @return {void} 
     */
    public warn(metadata: ILogMetadata, context?: any): void {
        this.log(LogLevelEnum.WARNING, metadata, context);
    }

    /**
     * Logs an information message.
     *
     * @param {ILogMetadata} metadata - the metadata for the log
     * @param {any} [context] - optional context for the log
     * @return {void} 
     */
    public info(metadata: ILogMetadata, context?: any): void {
        this.log(LogLevelEnum.INFO, metadata, context);
    }

    /**
     * A private function for logging messages at different levels.
     *
     * @param {LogLevelEnum} level - the log level
     * @param {ILogMetadata} metadata - the log metadata
     * @param {any} [context] - an optional context
     */
    private log(level: LogLevelEnum, metadata: ILogMetadata, context?: any): void {
        let logColor = '';
        let logLevel = '';
        let consoleFunc = (e:string) => {};
        switch (level) {
            case 'error':
                logColor = LogColorsEnum.red;
                logLevel = 'ERROR';
                consoleFunc = console.error;
                break;
            case 'warning':
                logColor = LogColorsEnum.yellow;
                logLevel = 'WARNING';
                consoleFunc = console.warn;
                break;
            case 'info':
                logColor = LogColorsEnum.cyan;
                logLevel = 'INFO';
                consoleFunc = console.info;
                break;
            default:
                logColor = LogColorsEnum.green;
                logLevel = 'LOG';
                consoleFunc = console.log;
        }

        const logEntry = this.getLogEntry(logColor, logLevel, metadata, context);
        this.generateDirectories('log', logEntry);
        this.generateDirectories('audit', logEntry);
        consoleFunc(logEntry);
    }

    /**
     * Generates a log entry with the given color, level, metadata, and optional context.
     *
     * @param {string} logColor - the color of the log entry
     * @param {string} logLevel - the level of the log entry
     * @param {ILogMetadata} metadata - the metadata for the log entry
     * @param {any} [context] - optional context for the log entry
     * @return {string} the generated log entry
     */
    private getLogEntry(logColor: string, logLevel: string, metadata: ILogMetadata, context?: any): string {
        if (context) {
            return `${LogColorsEnum.magenta}[Dalogger] [${this.generateCorrelationId()}] - ${LogColorsEnum.close}${this.generateDate()} ${logColor} ${logLevel} [${JSON.stringify(context)}] [UserIP: ${metadata.clientIp} URL:${metadata.url}] [${metadata.controller} - ${metadata.method}] ${LogColorsEnum.close}${LogColorsEnum.magenta}+${metadata.miliseconds}${LogColorsEnum.close}\n`;
        } else {
            return `${LogColorsEnum.magenta}[Dalogger] [${this.generateCorrelationId()}] - ${LogColorsEnum.close}${this.generateDate()} ${logColor} ${logLevel} [UserIP: ${metadata.clientIp} URL:${metadata.url}] [${metadata.controller} - ${metadata.method}] ${LogColorsEnum.close}${LogColorsEnum.magenta}+${metadata.miliseconds}${LogColorsEnum.close}\n`;
        }
    }

    generateCorrelationId(): string {
        return Math.random().toString(32).substring(2) + Date.now().toString(32)
    }

    /**
     * Generate a formatted date string including month, day, year, hours, minutes, seconds, and period (AM/PM).
     *
     * @return {string} formatted date string
     */
    generateDate(): string {
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const mins = String(date.getMinutes()).padStart(2, '0');
        const secs = String(date.getSeconds()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${month}/${day}/${year}, ${hours}:${mins}:${secs} ${period}`;
    }

    /**
     * Get the current date in the format 'YYYY-MM-DD'.
     *
     * @return {string} the current date
     */
    private getCurrentDate(): string {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    }

    private generateDirectories(type: string, logEntry: string): void {
        if (type === 'log') {
            if (!existsSync(this.logDir)) { mkdirSync(this.logDir, { recursive: true }); }
            appendFile(this.logFilePath, logEntry, (err) => {
                if (err) { console.error('Error al escribir en el archivo de log:', err); }
            });
        }
        if (type === 'audit') {
            if (!existsSync(this.auditDir)) { mkdirSync(this.auditDir, { recursive: true }); }
            writeFile(this.auditFilePath, JSON.stringify(logEntry, null, 2), (err) => {
                if (err) { console.error('Error al escribir en el archivo de audit:', err); }
            });
        }
    }
}
