import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment-timezone';

/** Класс отвечающий за перехват входящих запросов */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  /** Функция, которая логирует все запросы */
  public use(req: Request, res: Response, next: NextFunction): any {
    let result = `%c[${moment().format('HH:mm:ss DD.MM.YYYY')}][${req.method} ${req.url} ${JSON.stringify(req.query)}]`;
    result = result.concat(` ${JSON.stringify(req.body)}`);
    console.log(result, 'color: grey');
    next();
  }
}
