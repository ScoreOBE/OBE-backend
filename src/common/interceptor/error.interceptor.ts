import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) =>
        throwError(() => {
          if (err.name === 'CastError') {
            throw new BadRequestException(`Invalid ${err.path}: ${err.value}`);
          }
          if (err instanceof HttpException) {
            throw err;
          }
          const newError = new BadRequestException(err.message ?? err);
          if (err?.stack) {
            newError.stack = err.stack;
          }
          throw newError;
        }),
      ),
    );
  }
}
