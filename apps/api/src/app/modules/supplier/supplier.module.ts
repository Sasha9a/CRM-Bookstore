import { SupplierController } from "@crm/api/modules/supplier/supplier.controller";
import { SupplierService } from "@crm/api/modules/supplier/supplier.service";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Supplier, SupplierSchema } from "@crm/shared/schemas/supplier.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }]),
    UserModule
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService]
})
export class SupplierModule {}
