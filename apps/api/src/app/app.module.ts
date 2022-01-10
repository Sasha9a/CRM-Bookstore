import { LoggerMiddleware } from "@crm/api/core/middlewares/logger.middleware";
import { FileModule } from "@crm/api/modules/file/file.module";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { environment } from "../environments/environment";
import * as moment from "moment-timezone";

moment.locale('ru');

@Module({
  imports: [
    MongooseModule.forRoot(environment.db),
    FileModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
