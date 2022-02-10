import { SalaryController } from "@crm/api/modules/salary/salary.controller";
import { SalaryService } from "@crm/api/modules/salary/salary.service";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Salary, SalarySchema } from "@crm/shared/schemas/salary.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    UserModule
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
  exports: [SalaryService]
})
export class SalaryModule {}
