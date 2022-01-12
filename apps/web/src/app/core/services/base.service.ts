import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

/**
 * Базовый сервис
 * Определяет стандартные методы API
 */
@Injectable({
  providedIn: 'root'
})
export class BaseService {

  /**
   * Базовый url сервиса
   */
  protected baseUrl: string;

  public constructor(protected http: HttpClient) { }

  /**
   * Get-запрос Получение массива объектов
   * @param options параметры запроса
   * @return Массив объектов
   */
  public find<T>(options?: any): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, { params: this.getParams(options) });
  }

  /**
   * Get-запрос Получение объекта по идентификатору
   * @param id id объекта
   * @return Объект
   */
  public findById<T>(id: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + '/' + id);
  }

  /**
   * Post-запрос Создание объекта
   * @param model объект, который нужно создать
   * @return Созданный объект
   */
  public create<T>(model: any): Observable<T> {
    return this.http.post<T>(this.baseUrl, model);
  }

  /**
   * Put-запрос Изменения объекта
   * @param id id объекта
   * @param model объект, на который нужно изменить
   * @return Обновленный объект
   */
  public update<T>(id, model): Observable<T> {
    return this.http.put<T>(this.baseUrl + '/' + id, model);
  }

  /**
   * Delete-запрос Удаление объекта
   * @param id id объекта
   * @return Удаленный объект или ничего
   */
  public deleteById<T>(id: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + '/' + id);
  }

  /** Функция конвертирует параметры в удобный формат для запроса
   * @param options объект параметров
   * @return Объект параметров */
  protected getParams(options) {
    const params = {};
    if (options) {
      Object.entries(options).map((o) => {
        params[o[0]] = o[1];
      });
    }
    return params;
  }

}
