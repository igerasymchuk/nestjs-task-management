import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        interface ErrorResponse {
            status: string,
            message: string,
            error: string
        }
        
        const error = (errorResponse as ErrorResponse).error
        const res = {
            statusCode: status,
            message: exception.message,
            ...error && { error },
            timestamp: new Date().toISOString(),
            path: request.url,           
        }

        response
            .status(status)
            .json(res)
            // .json({
            //     statusCode: status,
            //     message: exception.message,
            //     error: error,
            //     timestamp: new Date().toISOString(),
            //     path: request.url,
            // });
    }
}