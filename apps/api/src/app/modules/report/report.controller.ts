import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { OrderService } from "@crm/api/modules/order/order.service";
import { ReceiptService } from "@crm/api/modules/receipt/receipt.service";
import { SalaryService } from "@crm/api/modules/salary/salary.service";
import { ShopService } from "@crm/api/modules/shop/shop.service";
import { SupplierService } from "@crm/api/modules/supplier/supplier.service";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverItemDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.item.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { TurnoverAnalyticsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.dto";
import { TurnoverAnalyticsItemDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.item.dto";
import { TurnoverAnalyticsQueryParamsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.query.params.dto";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { SupplierDto } from "@crm/shared/dtos/supplier/supplier.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Controller, Get, HttpStatus, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import * as moment from "moment-timezone";

/** Контроллер принимающие запросы по отчетностям */
@Controller('report')
export class ReportController {

  public constructor(private readonly orderService: OrderService,
                     private readonly salaryService: SalaryService,
                     private readonly receiptService: ReceiptService,
                     private readonly supplierService: SupplierService,
                     private readonly shopService: ShopService) {
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
    const suppliers: SupplierDto[] = await this.supplierService.findAll({
      dateFrom: {
        $gte: moment(queryParams.from, 'YYYY-MM-DD').toISOString(),
        $lte: moment(queryParams.to, 'YYYY-MM-DD').toISOString()
      }
    });

    let budgetItem: MoneyTurnoverItemDto = {
      name: 'Продажа товаров',
      moneyTurnover: {
        days: {},
        weeks: {},
        months: {}
      }
    }
    const dateToDay = moment(queryParams.to).clone().add(1, 'day');
    const dateToWeek = moment(queryParams.to).clone().add(1, 'week');
    const dateToMonth = moment(queryParams.to).clone().add(1, 'month');

    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      if (receipts.findIndex((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = receipts.filter((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToWeek, 'week'); date.add(1, 'week')) {
      if (receipts.findIndex((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = receipts.filter((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToMonth, 'month'); date.add(1, 'month')) {
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
    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      if (salaries.findIndex((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = salaries.filter((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToWeek, 'week'); date.add(1, 'week')) {
      if (salaries.findIndex((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = salaries.filter((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToMonth, 'month'); date.add(1, 'month')) {
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
    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      if (orders.findIndex((item) => moment(item.date).utcOffset('+03:00').format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = orders.filter((item) => moment(item.date).utcOffset('+03:00').format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToWeek, 'week'); date.add(1, 'week')) {
      if (orders.findIndex((item) => moment(item.date).utcOffset('+03:00').format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = orders.filter((item) => moment(item.date).utcOffset('+03:00').format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToMonth, 'month'); date.add(1, 'month')) {
      if (orders.findIndex((item) => moment(item.date).utcOffset('+03:00').format('YYYY-MM') === date.format('YYYY-MM')) !== -1) {
        const items = orders.filter((item) => moment(item.date).utcOffset('+03:00').format('YYYY-MM') === date.format('YYYY-MM'));
        budgetItem.moneyTurnover.months[date.format('YYYY-MM')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }
    result.expenses.push(budgetItem);

    budgetItem = {
      name: 'Оформление договоров',
      moneyTurnover: {
        days: {},
        weeks: {},
        months: {}
      }
    }
    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      if (suppliers.findIndex((item) => moment(item.dateFrom).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = suppliers.filter((item) => moment(item.dateFrom).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        budgetItem.moneyTurnover.days[date.format('YYYY-MM-DD')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToWeek, 'week'); date.add(1, 'week')) {
      if (suppliers.findIndex((item) => moment(item.dateFrom).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = suppliers.filter((item) => moment(item.dateFrom).format('YYYY-WW') === date.format('YYYY-WW'));
        budgetItem.moneyTurnover.weeks[date.format('YYYY-WW')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToMonth, 'month'); date.add(1, 'month')) {
      if (suppliers.findIndex((item) => moment(item.dateFrom).format('YYYY-MM') === date.format('YYYY-MM')) !== -1) {
        const items = suppliers.filter((item) => moment(item.dateFrom).format('YYYY-MM') === date.format('YYYY-MM'));
        budgetItem.moneyTurnover.months[date.format('YYYY-MM')] = items.reduce((sum, item) => sum + item.sum, 0);
      }
    }
    result.expenses.push(budgetItem);

    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      result.sums.days[date.format('YYYY-MM-DD')] = {
        income: result.income.reduce((sum, item) => {
          return sum + Object.entries(item.moneyTurnover.days).reduce((_sum, value) => {
            if (value[0] === date.format('YYYY-MM-DD')) {
              return _sum + value[1];
            }
            return _sum;
          }, 0);
        }, 0),
        expenses: result.expenses.reduce((sum, item) => {
          return sum + Object.entries(item.moneyTurnover.days).reduce((_sum, value) => {
            if (value[0] === date.format('YYYY-MM-DD')) {
              return _sum + value[1];
            }
            return _sum;
          }, 0);
        }, 0)
      };
    }
    for (const date = moment(queryParams.from); date.isBefore(dateToWeek, 'week'); date.add(1, 'week')) {
      result.sums.weeks[date.format('YYYY-WW')] = {
        income: result.income.reduce((sum, item) => {
          return sum + Object.entries(item.moneyTurnover.weeks).reduce((_sum, value) => {
            if (value[0] === date.format('YYYY-WW')) {
              return _sum + value[1];
            }
            return _sum;
          }, 0);
        }, 0),
        expenses: result.expenses.reduce((sum, item) => {
          return sum + Object.entries(item.moneyTurnover.weeks).reduce((_sum, value) => {
            if (value[0] === date.format('YYYY-WW')) {
              return _sum + value[1];
            }
            return _sum;
          }, 0);
        }, 0)
      };
    }
    for (const date = moment(queryParams.from); date.isBefore(dateToMonth, 'month'); date.add(1, 'month')) {
      result.sums.months[date.format('YYYY-MM')] = {
        income: result.income.reduce((sum, item) => {
          return sum + Object.entries(item.moneyTurnover.months).reduce((_sum, value) => {
            if (value[0] === date.format('YYYY-MM')) {
              return _sum + value[1];
            }
            return _sum;
          }, 0);
        }, 0),
        expenses: result.expenses.reduce((sum, item) => {
          return sum + Object.entries(item.moneyTurnover.months).reduce((_sum, value) => {
            if (value[0] === date.format('YYYY-MM')) {
              return _sum + value[1];
            }
            return _sum;
          }, 0);
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

  /** Get-запрос на получение данных по аналитике товарооборота
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает данные по аналитике товарооборота */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('turnover-analytics')
  public async turnoverAnalytics(@Res() res: Response, @Query() queryParams: TurnoverAnalyticsQueryParamsDto) {
    const result: TurnoverAnalyticsDto = {
      items: [],
      sums: {
        averageCheck: 0,
        averageNumberOfChecks: 0,
        allChecks: 0,
        popularProduct: undefined,
        popularCategory: undefined
      }
    };

    let receipts: ReceiptDto[];
    const shops: ShopDto[] = await this.shopService.findAll();
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
    } else if (queryParams) {
      receipts = await this.receiptService.findAll({ ...filterDates });
    }

    if (queryParams.shop !== 'undefined') {
      receipts = receipts.filter((receipt) => receipt.shop?._id === queryParams.shop);
    }

    const dateToDay = moment(queryParams.to).clone().add(1, 'day');

    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      for (const shop of shops) {
        if (receipts.findIndex((item) =>
          moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
          && shop._id == item.shop?._id) !== -1) {
          const items = receipts.filter((item) =>
            moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
            && shop._id == item.shop?._id
          );

          const popularProducts: { product: Partial<ProductDto>, count: number }[] = [];
          items.forEach((item) => {
            item.products.forEach((product) => {
              if (popularProducts.findIndex((p) => product._id === p.product?._id) === -1) {
                popularProducts.push({
                  product: { _id: product._id, name: product.name },
                  count: 1
                });
              } else {
                popularProducts.forEach((p) => {
                  if (product._id === p.product?._id) {
                    p.count++;
                  }
                });
              }
            });
          });
          popularProducts.sort((a, b) => a.count > b.count ? -1 : 1);

          const popularCategories: { category: Partial<CategoryDto>, count: number }[] = [];
          items.forEach((item) => {
            item.products.forEach((product) => {
              if (product.category) {
                if (popularCategories.findIndex((p) => product.category?._id === p.category?._id) === -1) {
                  popularCategories.push({
                    category: { _id: product.category?._id, name: product.category?.name },
                    count: 1
                  });
                } else {
                  popularCategories.forEach((p) => {
                    if (product.category?._id === p.category?._id) {
                      p.count++;
                    }
                  });
                }
              }
            });
          });
          popularCategories.sort((a, b) => a.count > b.count ? -1 : 1);

          const data: TurnoverAnalyticsItemDto = {
            countReceipt: items.reduce((sum) => sum + 1, 0),
            sumReceipt: items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0),
            averageCheck: items.reduce((sum, item) => sum + item.amountCash + item.amountCashless, 0) / items.reduce((sum) => sum + 1, 0),
            popularProduct: popularProducts[0]?.product,
            popularCategory: popularCategories[0]?.category,
            date: date.toDate(),
            shop: shop,

          };
          result.items.push(data);
        }
      }
    }

    const popularProducts: { product: Partial<ProductDto>, count: number }[] = [];
    result.items.forEach((item) => {
      if (popularProducts.findIndex((p) => item.popularProduct?._id === p.product?._id) === -1) {
        popularProducts.push({
          product: { _id: item.popularProduct?._id, name: item.popularProduct?.name },
          count: 1
        });
      } else {
        popularProducts.forEach((p) => {
          if (item.popularProduct?._id === p.product?._id) {
            p.count++;
          }
        });
      }
    });
    popularProducts.sort((a, b) => a.count > b.count ? -1 : 1);

    const popularCategories: { category: Partial<CategoryDto>, count: number }[] = [];
    result.items.forEach((item) => {
      if (item.popularCategory) {
        if (popularCategories.findIndex((p) => item.popularCategory?._id === p.category?._id) === -1) {
          popularCategories.push({
            category: { _id: item.popularCategory?._id, name: item.popularCategory?.name },
            count: 1
          });
        } else {
          popularCategories.forEach((p) => {
            if (item.popularCategory?._id === p.category?._id) {
              p.count++;
            }
          });
        }
      }
    });
    popularCategories.sort((a, b) => a.count > b.count ? -1 : 1);

    result.sums.averageCheck = result.items.reduce((sum, item) => sum + item.averageCheck, 0) / result.items.length;
    result.sums.averageNumberOfChecks = result.items.reduce((sum, item) => sum + item.countReceipt, 0) / result.items.length;
    result.sums.allChecks = result.items.reduce((sum, item) => sum + item.countReceipt, 0);
    result.sums.popularProduct = popularProducts[0]?.product;
    result.sums.popularCategory = popularCategories[0]?.category;

    return res.status(HttpStatus.OK).json(result).end();
  }
}
