import { OrderModule } from "@crm/api/modules/order/order.module";
import { ReceiptModule } from "@crm/api/modules/receipt/receipt.module";
import { ReportController } from "@crm/api/modules/report/report.controller";
import { SalaryModule } from "@crm/api/modules/salary/salary.module";
import { ShopModule } from "@crm/api/modules/shop/shop.module";
import { SupplierModule } from "@crm/api/modules/supplier/supplier.module";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    UserModule,
    ShopModule,
    ReceiptModule,
    SalaryModule,
    OrderModule,
    SupplierModule
  ],
  controllers: [ReportController]
})
export class ReportModule {}
