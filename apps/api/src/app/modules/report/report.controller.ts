import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Controller, Get, HttpStatus, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по отчетностям */
@Controller('report')
export class ReportController {

  public constructor() {
  }

  /** Get-запрос на получение данных по обороту денег
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает данные по обороту денег */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('money-turnover')
  public async moneyTurnover(@Res() res: Response, @Query() queryParams: MoneyTurnoverQueryParamsDto) {
    const result: MoneyTurnoverDto = {
      income: [],
      expenses: [],
      sums: {
        days: {},
        weeks: {},
        months: {},
        income: 0,
        expenses: 0
      }
    };

    return res.status(HttpStatus.OK).json(result).end();
  }
}
