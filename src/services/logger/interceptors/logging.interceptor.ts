import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CustomLogger } from 'src/services/logger/custom.logger';
import { LogMetadata } from '../interfaces/LogMetadata.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly customLogger: CustomLogger) { }
  /**
   * intercepts the execution context and call handler
   *
   * @param {ExecutionContext} context - the execution context
   * @param {CallHandler} next - the call handler
   * @return {Observable<any>} the observable of any type
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const clientIp = this.getClientIp(req);
    const controllerInstantiated = context.getClass().name; // Obtener la clase del controlador
    const methodInstantiated = context.getHandler().name; // Obtener el identificador del método del controlador
    const now = Date.now();
    const metadata: LogMetadata = {
      clientIp, controller: controllerInstantiated, method: methodInstantiated, url: req.url, timestamp: `${Date.now() - now}ms`
    }
    this.customLogger.info(metadata);
    return next.handle().pipe(
      tap(() => { this.customLogger.info({ ...metadata, timestamp: `${Date.now() - now}ms` }); }));
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
}
