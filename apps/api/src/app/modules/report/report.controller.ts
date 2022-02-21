import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { OrderService } from "@crm/api/modules/order/order.service";
import { ReceiptService } from "@crm/api/modules/receipt/receipt.service";
import { SalaryService } from "@crm/api/modules/salary/salary.service";
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverItemDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.item.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Controller, Get, HttpStatus, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import * as moment from "moment-timezone";

/** Контроллер принимающие запросы по отчетностям */
@Controller('report')
export class ReportController {

  public constructor(private readonly orderService: OrderService,
                     private readonly salaryService: SalaryService,
                     private readonly receiptService: ReceiptService) {
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

    let orders: OrderDto[];
    let receipts: ReceiptDto[];
    let salaries: SalaryDto[];
    const filterDates = {
      date: {
        $gte: moment(queryParams.from, 'YYYY-MM-DD').toISOString(),
        $lte: moment(queryParams.to, 'YYYY-MM-DD').toISOString()
      }
    };
    if (queryParams.shop !== 'undefined') {
      receipts = await this.receiptService.findAll({
        ...filterDates,
        'shop._id': queryParams.shop
      });
      salaries = await this.salaryService.findAll({
        ...filterDates,
        shop: queryParams.shop
      });
      orders = await this.orderService.findAll({
        ...filterDates,
        'shop._id': queryParams.shop
      });
    } else if (queryParams) {
      receipts = await this.receiptService.findAll({ ...filterDates });
      salaries = await this.salaryService.findAll({ ...filterDates });
      orders = await this.orderService.findAll({ ...filterDates });
    }

    let budgetItem: MoneyTurnoverItemDto = {
      name: 'Продажа товаров',
      moneyTurnover: {
        days: {},
        weeks: {},
        months: {}
      }
    }
    const dateTo = moment(queryParams.to).clone().add(1, 'day');

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'day'); date.add(1, 'day')) {
      if (receipts.findIndex((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = receipts.filter((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'week'); date.add(1, 'week')) {
      if (receipts.findIndex((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = receipts.filter((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'month'); date.add(1, 'month')) {
      if (receipts.findIndex((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM')) !== -1) {
        const items = receipts.filter((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM'));
        budgetItem.moneyTurnover.months[date.format('YYYY-MM')] = items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0);
      }
    }
    result.income.push(budgetItem);

    budgetItem = {
      name: 'Выплата зарплат',
      moneyTurnover: {
        days: {},
        weeks: {},
        months: {}
      }
    }
    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'day'); date.add(1, 'day')) {
      if (salaries.findIndex((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = salaries.filter((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'week'); date.add(1, 'week')) {
      if (salaries.findIndex((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = salaries.filter((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'month'); date.add(1, 'month')) {
      if (salaries.findIndex((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM')) !== -1) {
        const items = salaries.filter((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM'));
        budgetItem.moneyTurnover.months[date.format('YYYY-MM')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }
    result.expenses.push(budgetItem);

    budgetItem = {
      name: 'Оформление заказов',
      moneyTurnover: {
        days: {},
        weeks: {},
        months: {}
      }
    }
    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'day'); date.add(1, 'day')) {
      if (orders.findIndex((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = orders.filter((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'week'); date.add(1, 'week')) {
      if (orders.findIndex((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = orders.filter((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'month'); date.add(1, 'month')) {
      if (orders.findIndex((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM')) !== -1) {
        const items = orders.filter((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM'));
        budgetItem.moneyTurnover.months[date.format('YYYY-MM')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }
    result.expenses.push(budgetItem);

    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'day'); date.add(1, 'day')) {
      result.sums.days[date.format('YYYY-MM-DD')] = {
        income: result.income.reduce((sum, item) => {
          return sum + Object.values(item.moneyTurnover.days).reduce((_sum, value) => _sum + value, 0);
        }, 0),
        expenses: result.expenses.reduce((sum, item) => {
          return sum + Object.values(item.moneyTurnover.days).reduce((_sum, value) => _sum + value, 0);
        }, 0)
      };
    }
    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'week'); date.add(1, 'week')) {
      result.sums.weeks[date.format('YYYY-WW')] = {
        income: result.income.reduce((sum, item) => {
          return sum + Object.values(item.moneyTurnover.weeks).reduce((_sum, value) => _sum + value, 0);
        }, 0),
        expenses: result.expenses.reduce((sum, item) => {
          return sum + Object.values(item.moneyTurnover.weeks).reduce((_sum, value) => _sum + value, 0);
        }, 0)
      };
    }
    for (const date = moment(queryParams.from); date.isBefore(dateTo, 'month'); date.add(1, 'month')) {
      result.sums.months[date.format('YYYY-MM')] = {
        income: result.income.reduce((sum, item) => {
          return sum + Object.values(item.moneyTurnover.months).reduce((_sum, value) => _sum + value, 0);
        }, 0),
        expenses: result.expenses.reduce((sum, item) => {
          return sum + Object.values(item.moneyTurnover.months).reduce((_sum, value) => _sum + value, 0);
        }, 0)
      };
    }
    for (const income of result.income) {
      result.sums.income += Object.values(income.moneyTurnover.months).reduce((sum, value) => sum + value, 0);
    }
    for (const expenses of result.expenses) {
      result.sums.expenses += Object.values(expenses.moneyTurnover.months).reduce((sum, value) => sum + value, 0);
    }

    return res.status(HttpStatus.OK).json(result).end();
  }
}