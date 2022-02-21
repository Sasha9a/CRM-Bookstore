import { ReceiptModule } from "@crm/api/modules/receipt/receipt.module";
import { ReportController } from "@crm/api/modules/report/report.controller";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    UserModule,
    ReceiptModule
  ],
  controllers: [ReportController]
})
export class ReportModule {}
