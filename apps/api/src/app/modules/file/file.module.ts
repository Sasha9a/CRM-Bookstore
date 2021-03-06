import { FileController } from "@crm/api/modules/file/file.controller";
import { FileService } from "@crm/api/modules/file/file.service";
import { File, FileSchema } from "@crm/shared/schemas/file.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
