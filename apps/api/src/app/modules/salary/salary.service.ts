import { BaseService } from "@crm/api/core/services/base.service";
import { Salary } from "@crm/shared/schemas/salary.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД зарплат */
@Injectable()
export class SalaryService extends BaseService<Salary> {

  public constructor(@InjectModel(Salary.name) private readonly salaryModel: Model<Salary>) {
    super(salaryModel);
  }

  /** Получить последние данные зарплаты по конкретному сотруднику
   * @param userId ID сотрудника
   * @param limit Сколько данных нужно получить
   * @return Массив данных о зарплатах */
  public findAllFromUser(userId: string, limit = 10): Promise<Salary[]> {
    return this.salaryModel.find({ info: { $elemMatch: { user: { _id: userId } } } }).sort({ date: -1 }).limit(limit).exec();
  }

}
