import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";
import { Observable } from "rxjs";

/**
 * Базовый-связной сервис
 * Определяет стандартные методы API
 */
@Injectable({
  providedIn: 'root'
})
export class BaseStateService {

  /**
   * Сервис сущности
   */
  protected baseService: BaseService;

  /**
   * Get-запрос Получение массива объектов
   * @param options параметры запроса
   * @return Массив объектов
   */
  public find<T>(options?: any): Observable<T[]> {
    return this.baseService.find<T>(options);
  }

  /**
   * Get-запрос Получение объекта по идентификатору
   * @param id id объекта
   * @return Объект
   */
  public findById<T>(id: string): Observable<T> {
    return this.baseService.findById<T>(id);
  }

  /**
   * Post-запрос Создание объекта
   * @param model объект, который нужно создать
   * @return Созданный объект
   */
  public create<T, K>(model: T): Observable<K> {
    return this.baseService.create<K>(model);
  }

  /**
   * Put-запрос Изменения объекта
   * @param id id объекта
   * @param model объект, на который нужно изменить
   * @return Обновленный объект
   */
  public update<T>(id, model: T): Observable<T> {
    return this.baseService.update<T>(id, model);
  }

  /**
   * Delete-запрос Удаление объекта
   * @param id id объекта
   * @return Удаленный объект или ничего
   */
  public deleteById(id: string): Observable<null> {
    return this.baseService.deleteById(id);
  }

}
