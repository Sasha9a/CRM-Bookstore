import { Injectable } from '@angular/core';
import { ConfirmationService } from "primeng/api";

/** Интерфейс для работы с всплывающим диалоговым окном */
interface ConfirmData {

  /** Текст диалогового окна */
  message?: string;

  /** Иконка диалогового окна */
  icon?: string;

  /** Событие на клик согласия */
  accept: () => any;

  /** Событие на клик отказа */
  reject?: () => any;
}

/** Сервис для удобной работы с всплывающим диалоговым окном */
@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  public constructor(private readonly confirmationService: ConfirmationService) {}

  /** Функция создания всплывающего диалогового окна
   * @param data Данные для диалогового окна */
  public confirm(data: ConfirmData) {
    this.confirmationService.confirm({
      message: data.message || '',
      header: 'Подтверждение действия',
      icon: data.icon || 'pi pi-info-circle',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      accept: data.accept || (() => null),
      reject: data.reject || (() => null),
    });
  }

}
