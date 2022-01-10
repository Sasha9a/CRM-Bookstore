import { FileDto } from "@crm/shared/dtos/file.dto";
import { File } from "@crm/shared/schemas/file.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД файла */
@Injectable()
export class FileService {

  public constructor(@InjectModel(File.name) private readonly fileModel: Model<File>) {
  }

  /** Функция загружает файл в базу данных
   * @param file данные о файле
   * @return Возвращает объект файла */
  public async upload(file: FileDto): Promise<File> {
    const uploadFile = new this.fileModel(file);
    return uploadFile.save();
  }

  /** Функция удаляет файл из базы данных и возвращает удаленный объект
   * @param path зашифрованное название файла */
  public async deleteFile(path: string): Promise<any> {
    return await this.fileModel.findOneAndDelete({ path: path }).exec();
  }
}
