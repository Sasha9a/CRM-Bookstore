import { UserFormDto } from "@crm/shared/dtos/user/user.form.dto";
import { User } from "@crm/shared/schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД пользователя */
@Injectable()
export class UserService {

  public constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
  }

  /** Функция создает пользователя в базу данных
   * @param user данные о пользователе
   * @return Возвращает объект пользователя */
  public async create(user: UserFormDto): Promise<User> {
    const createUser = await new this.userModel(user);
    return createUser.save();
  }

  /** Функция ищет всех пользователей в БД
   * @return Возвращает массив пользователей */
  public async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  /** Функция ищет пользователя в БД по ID
   * @param id ID пользователя
   * @return Возвращает объект пользователя */
  public async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
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
