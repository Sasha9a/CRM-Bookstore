import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

/** Сервис для удобной работы с фильтрами */
@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  /** Функция конвертирует дату в удобный формат даты фильтра
   * @param dates даты
   * @param storageName название пути по которому сохраняется даты в локальной памяти браузера
   * @return Отформатированные даты */
  public formatISOPeriod(dates: [Date, Date], storageName?: string): [Date, Date] {
    const from = moment(dates[0]).format('YYYY-MM-DD');
    const to = moment(dates[1]).format('YYYY-MM-DD');

    if (storageName) {
      localStorage.setItem(`${storageName}.from`, from);
      localStorage.setItem(`${storageName}.to`, to);
    }

    return [from as unknown as Date, to as unknown as Date];
  }

}
