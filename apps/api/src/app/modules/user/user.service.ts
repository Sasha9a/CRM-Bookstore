import { BaseService } from "@crm/api/core/services/base.service";
import { User } from "@crm/shared/schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД пользователя */
@Injectable()
export class UserService extends BaseService<User> {

  public constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  /** Функция ищет пользователя в БД по логину
   * @param login Логин пользователя
   * @return Возвращает объект пользователя */
  public async findByLogin(login: string): Promise<User> {
    return await this.userModel.findOne({ login: login }).exec();
  }

  /** Функция ищет пользователя в БД по токену
   * @param token Токен пользователя
   * @return Возвращает объект пользователя */
  public async findByToken(token: string): Promise<User> {
    return await this.userModel.findOne({ token: token }).exec();
  }

  /** Функция задает токен пользователю в БД
   * @param id ID пользователя
   * @param token Новый токен */
  public async setToken(id: string, token: string): Promise<any> {
    return await this.userModel.updateOne({ _id: id }, { $set: { token: token } }).exec();
  }

  /** Функция удаляет токен у пользователя в БД
   * @param id ID пользователя */
  public async logout(id: string): Promise<any> {
    return await this.userModel.updateOne({ _id: id }, { $unset: { token: '' } }).exec();
  }

}
