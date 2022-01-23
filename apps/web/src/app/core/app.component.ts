import { Component, OnInit } from '@angular/core';
import { RoutingService } from "@crm/web/core/services/routing.service";
import { PrimeNGConfig } from "primeng/api";

/** Родительский компонент */
@Component({
  selector: 'crm-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit {

  public constructor(public readonly routingService: RoutingService,
                     private readonly config: PrimeNGConfig) {}

  public ngOnInit() {
    this.config.setTranslation({
      startsWith: 'Начинается с',
      contains: 'Содержит',
      notContains: 'Не содержит',
      endsWith: 'Оканчивается на',
      equals: 'Равно',
      notEquals: 'Не равно',
      noFilter: 'Нет фильтра',
      lt: 'Меньше чем',
      lte: 'Меньше или равно',
      gt: 'Больше чем',
      gte: 'Больше или равно',
      is: 'Равно',
      isNot: 'Не равно',
      before: 'Перед',
      after: 'После',
      dateIs: 'Дата',
      dateIsNot: 'Дата не',
      dateBefore: 'Дата перед',
      dateAfter: 'Дата после',
      apply: 'Применить',
      matchAll: 'Все совпадения',
      matchAny: 'Любое совпадение',
      addRule: 'Добавить правило',
      removeRule: 'Удалить правило',
      accept: 'Да',
      reject: 'Нет',
      choose: 'Выбрать',
      upload: 'Загрузить',
      cancel: 'Отменить',
      weekHeader: 'Неделя',
      weak: 'Слабый',
      medium: 'Средний',
      strong: 'Сильный',
      passwordPrompt: 'Введите пароль',
      emptyMessage: '',
      emptyFilterMessage: '',
      dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      today: 'Сегодня',
      clear: 'Очистить'
    });

  }
}
