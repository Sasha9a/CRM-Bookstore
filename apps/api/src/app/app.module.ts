import { LoggerMiddleware } from "@crm/api/core/middlewares/logger.middleware";
import { CategoryModule } from "@crm/api/modules/category/category.module";
import { FileModule } from "@crm/api/modules/file/file.module";
import { ProductModule } from "@crm/api/modules/product/product.module";
import { ShopModule } from "@crm/api/modules/shop/shop.module";
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
    ProductModule
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
