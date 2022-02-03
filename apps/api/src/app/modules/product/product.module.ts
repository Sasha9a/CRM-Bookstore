import { ProductController } from "@crm/api/modules/product/product.controller";
import { ProductService } from "@crm/api/modules/product/product.service";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Product, ProductSchema } from "@crm/shared/schemas/product.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
