import { ProductModule } from "@crm/api/modules/product/product.module";
import { ReceiptController } from "@crm/api/modules/receipt/receipt.controller";
import { ReceiptService } from "@crm/api/modules/receipt/receipt.service";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Receipt, ReceiptSchema } from "@crm/shared/schemas/receipt.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }]),
    UserModule,
    ProductModule
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService]
})
export class ReceiptModule {}
