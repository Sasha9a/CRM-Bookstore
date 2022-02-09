import { Pipe, PipeTransform } from '@angular/core';
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";

const scheduleName = {
  [ScheduleEnum.FIVE]: '5/2',
  [ScheduleEnum.SHIFT]: '2/2'
};

/** Пайп конвертирует enum в человеческое название графика работы */
@Pipe({
  name: 'scheduleName'
})
export class ScheduleNamePipe implements PipeTransform {

  public transform(value: ScheduleEnum): string {
    return scheduleName[value] || '';
  }

}
