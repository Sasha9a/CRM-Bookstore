import { LoggerMiddleware } from "@crm/api/core/middlewares/logger.middleware";
import { CategoryModule } from "@crm/api/modules/category/category.module";
import { FileModule } from "@crm/api/modules/file/file.module";
import { OrderModule } from "@crm/api/modules/order/order.module";
import { ProductModule } from "@crm/api/modules/product/product.module";
import { ReceiptModule } from "@crm/api/modules/receipt/receipt.module";
import { ReportModule } from "@crm/api/modules/report/report.module";
import { SalaryModule } from "@crm/api/modules/salary/salary.module";
import { ShopModule } from "@crm/api/modules/shop/shop.module";
import { SupplierModule } from "@crm/api/modules/supplier/supplier.module";
import { TrafficModule } from "@crm/api/modules/traffic/traffic.module";
import { UserModule } from "@crm/api/modules/user/user.module";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { environment } from "../environments/environment";
import * as moment from "moment-timezone";

moment.locale('ru');

/** Первый модуль и основной модуль проекта */
@Module({
  imports: [
    MongooseModule.forRoot(environment.db, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    }),
    FileModule,
    UserModule,
    ShopModule,
    CategoryModule,
    ProductModule,
    SalaryModule,
    ReceiptModule,
    OrderModule,
    TrafficModule,
    ReportModule,
    SupplierModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  /** Конфигурируем проект, добавляем логирование всех запросов */
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
