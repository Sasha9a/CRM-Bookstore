import { Pipe, PipeTransform } from '@angular/core';

/** Пайп форматирует номер телефона */
@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  public transform(str: any): any {
    return str ? '+' + str.toString().replace(/[^0-9.]/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})(\d+)?/, '$1 ($2) $3-$4-$5 $6') : '';
  }

}
