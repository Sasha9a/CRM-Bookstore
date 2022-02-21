import { OrderModule } from "@crm/api/modules/order/order.module";
import { ReceiptModule } from "@crm/api/modules/receipt/receipt.module";
import { ReportController } from "@crm/api/modules/report/report.controller";
import { SalaryModule } from "@crm/api/modules/salary/salary.module";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    UserModule,
    ReceiptModule,
    SalaryModule,
    OrderModule
  ],
  controllers: [ReportController]
})
export class ReportModule {}
