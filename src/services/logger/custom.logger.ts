import { appendFile, writeFile, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { LogMetadata } from './interfaces/LogMetadata.interface';
import { LogColorsEnum } from './enums/LogColors.enum';
import { LogLevelEnum } from './enums/LogLevel.enum';

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
     * @param {LogMetadata} metadata - the metadata for the error log
     * @return {void} 
     */
    public log(metadata: LogMetadata): void {
        this.createLog(LogLevelEnum.LOG, metadata);
    }

    /**
     * Logs an error message with the given metadata and context.
     *
     * @param {LogMetadata} metadata - the metadata for the error log
     * @return {void} 
     */
    public error(metadata: LogMetadata): void {
        this.createLog(LogLevelEnum.ERROR, metadata);
    }

    /**
     * Warns about the log with the given metadata and context.
     *
     * @param {LogMetadata} metadata - the metadata for the log
     * @return {void} 
     */
    public warn(metadata: LogMetadata): void {
        this.createLog(LogLevelEnum.WARNING, metadata);
    }

    /**
     * Logs an information message.
     *
     * @param {LogMetadata} metadata - the metadata for the log
     * @return {void} 
     */
    public info(metadata: LogMetadata): void {
        this.createLog(LogLevelEnum.INFO, metadata);
    }

    /**
     * A private function for logging messages at different levels.
     *
     * @param {LogLevelEnum} level - the log level
     * @param {LogMetadata} metadata - the log metadata
     */
    private createLog(level: LogLevelEnum, metadata: LogMetadata): void {
        let logColor = '';
        let logLevel = '';
        let consoleFunc = (e: string) => { };
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

        const logEntry = this.getLogEntry(logColor, logLevel, metadata);
        this.generateDirectories('log', logEntry);
        this.generateDirectories('audit', logEntry);
        consoleFunc(logEntry);
    }


    /**
     * Generates a log entry with the given parameters.
     *
     * @param {string} logColor - the color of the log entry
     * @param {string} logLevel - the level of the log entry
     * @param {LogMetadata} metadata - the metadata for the log entry
     * @returns {string} the generated log entry
     */
    private getLogEntry(logColor: string, logLevel: string, metadata: LogMetadata): string {
        const metadataEntries = Object.entries(metadata).map(([key, value]) => ` - ${key}: ${value}`);
        const message = metadataEntries.join('\n');
        return `\n${LogColorsEnum.green}[Dalogger] [${this.generateCorrelationId()}] - ${LogColorsEnum.close}${this.generateDate()} ${logColor} ${logLevel} ${message} ${LogColorsEnum.green} +${metadata.timestamp}`;
    }


    /**
     * Generates a unique correlation ID using a combination of random number and current timestamp.
     *
     * @return {string} the generated correlation ID
     */
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

    /**
     * Generate directories based on the type of log entry.
     *
     * @param {string} type - the type of log entry
     * @param {string} logEntry - the log entry to be written
     * @return {void} 
     */
    private generateDirectories(type: string, logEntry: string): void {
        if (type === 'log') {
            if (!existsSync(this.logDir)) { mkdirSync(this.logDir, { recursive: true }); }
            appendFile(this.logFilePath, logEntry, (err) => {
                if (err) { console.error('Error al escribir en el archivo log:', err); }
            });
        }
        if (type === 'audit') {
            if (!existsSync(this.auditDir)) { mkdirSync(this.auditDir, { recursive: true }); }
            writeFile(this.auditFilePath, JSON.stringify(logEntry, null, 2), (err) => {
                if (err) { console.error('Error al escribir en el archivo audit:', err); }
            });
        }
    }
}
