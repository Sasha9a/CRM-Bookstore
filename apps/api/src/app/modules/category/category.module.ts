import { CategoryController } from "@crm/api/modules/category/category.controller";
import { CategoryService } from "@crm/api/modules/category/category.service";
import { ProductModule } from "@crm/api/modules/product/product.module";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Category, CategorySchema } from "@crm/shared/schemas/category.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    UserModule,
    ProductModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
