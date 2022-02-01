import { UserService } from "@crm/api/modules/user/user.service";
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment-timezone';

/** Класс отвечающий за перехват входящих запросов */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  public constructor(private readonly userService: UserService) {
  }

  /** Функция, которая логирует все запросы */
  public async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    let user = null;
    if (req.headers.authorization) {
      user = await this.userService.findByToken(req.headers.authorization.replace("Bearer ", ""));
    } else if (req.query['token']) {
      user = await this.userService.findByToken(req.query['token'] as string);
    }
    let result = `--> [${moment().format('HH:mm:ss DD.MM.YYYY')}][${req.method} ${req.url} ${JSON.stringify(req.query)}] (USER ${JSON.stringify(user)})`;
    result = result.concat(` ${JSON.stringify(req.body)}`);
    console.log('\x1b[90m%s\x1b[0m', result);
    next();
  }
}
