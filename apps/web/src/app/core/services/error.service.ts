import { Injectable } from '@angular/core';
import { MessageService } from "primeng/api";

/** Сервис для удобной работы с уведомлениями */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public constructor(private readonly messageService: MessageService) { }

  /** Функция для вызова уведомления с ошибкой
   * @param title заголовок
   * @param description описание
   * @param life время показа уведомления (в миллисекундах) */
  public addCustomError(title = 'Ошибка', description = '', life = 10000) {
    this.messageService.add({ severity: 'error', summary: title, detail: description, life });
  }

  /** Функция для вызова уведомления с ошибкой (при возврате с API)
   * @param title заголовок
   * @param error ошибка */
  public addDefaultError(error: any, title = 'Ошибка') {
    if (error.error?.statusCode === 403) {
      return this.messageService.add({ severity: 'error', summary: title, detail: 'Отказано в доступе', life: 10000 });
    }

    const description = error.error?.message || error.message || error.error || error.detail || '';

    if (typeof description === 'string') {
      return this.messageService.add({ severity: 'error', summary: title, detail: description, life: 10000 });
    } else if (typeof description === 'object') {
      Object.keys(description).forEach((key) => {
        if (description[key]) {
          this.messageService.add({
            severity: 'error',
            summary: title,
            detail: description[key].map((value) => value).join(', '),
            life: 10000
          });
        }
      });
    } else if (Array.isArray(description)) {
      description.forEach((item) => {
        if (typeof item === 'string') {
          return this.messageService.add({ severity: 'error', summary: title, detail: item, life: 10000 });
        }
      });
    }
  }

  /** Функция для вызова уведомления с ошибкой (при неправильной заполнения формы)
   * @param form ошибки
   * @param life время показа уведомления (в миллисекундах) */
  public errorValues<T>(form: Record<keyof T, any[]>, life = 10000) {
    const error = Object.values(form).map((er: any[]) => er?.map((er1) => `${er1}`).join(', ')).join(', ');
    this.messageService.add({ severity: 'error', summary: 'Заполните все поля', detail: error, life });
  }

  /** Функция для вызова удачного уведомления
   * @param title заголовок
   * @param description описание
   * @param life время показа уведомления (в миллисекундах) */
  public addSuccessMessage(title: string = 'ОК', description: string = '', life = 10000) {
    this.messageService.add({ severity: 'success', summary: title, detail: description, life });
  }

}
