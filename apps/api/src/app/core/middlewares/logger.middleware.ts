import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment-timezone';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction): any {
    let result = `[${moment().format('HH:mm:ss DD.MM.YYYY')}][${req.method} ${req.url} ${JSON.stringify(req.query)}]`;
    result = result.concat(` ${JSON.stringify(req.body)}`);
    console.log(result);
    next();
  }
}
