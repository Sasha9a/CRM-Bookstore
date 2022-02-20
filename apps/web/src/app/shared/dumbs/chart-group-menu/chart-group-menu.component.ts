import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartGroupPeriodEnum } from "@crm/web/core/models/chart-group-period.enum";

@Component({
  selector: 'crm-chart-group-menu',
  templateUrl: './chart-group-menu.component.html',
  styleUrls: []
})
export class ChartGroupMenuComponent {

  public groups: {
    period: ChartGroupPeriodEnum,
    label: string
  }[] = [
    { period: ChartGroupPeriodEnum.days, label: 'День' },
    { period: ChartGroupPeriodEnum.weeks, label: 'Неделя' },
    { period: ChartGroupPeriodEnum.months, label: 'Месяц' }
  ];

  @Input() public activeGroupPeriod = ChartGroupPeriodEnum.days;
  @Output() public activeGroupPeriodChange = new EventEmitter<ChartGroupPeriodEnum>();

}
