import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from "@nestjs/common";
import { CustomLogger } from "../logger/custom.logger";
import { LogMetadata } from "../logger/interfaces/LogMetadata.interface";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(CustomLogger) private readonly customLogger: CustomLogger) { }
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const clientIp = this.getClientIp(req);
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const jsonResponse = this.buildResponse(exception)
        this.customLogger.error({ clientIp, url: req.url, ...jsonResponse, stackTrace: exception.stack });
        response.status(status).json(jsonResponse);
    }

    /**
   * Get the client IP address from the request.
   *
   * @param {any} req - the request object
   * @return {string} the client IP address
   */
    getClientIp(req: any): string {
        const xForwardedFor = (req.headers['x-forwarded-for'] || '').split(',').pop() || req.connection.remoteAddress;
        return xForwardedFor.trim();
    }

    buildResponse(exception: HttpException): Object {
        const responseException = exception.getResponse();
        let logMetadataException: LogMetadata = {
            statusCode: exception.getStatus(),
            timestamp: new Date().toISOString(),
        }

        if (typeof responseException === 'object') {
            logMetadataException = { ...logMetadataException, ...responseException }
        }

        return logMetadataException
    }
}