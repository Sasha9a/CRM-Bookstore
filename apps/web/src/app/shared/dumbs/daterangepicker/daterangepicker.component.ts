import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { unitOfTime } from "moment-timezone";
import { Calendar } from "primeng/calendar";
import * as moment from "moment-timezone";

/** Компонент модифицирующий стандартный ввод периода дат */
@Component({
  selector: 'crm-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: []
})
export class DaterangepickerComponent {

  @ViewChild('rangepicker') public rangepicker: Calendar;
  @Output() public valueChange = new EventEmitter<Date>();
  @Input() public showButtonBar = false;
  @Input() public dateFormat = 'dd.mm.yy';
  @Input() public label: string;
  @Input() public inputId = `${Math.random()}`;
  @Input() public placeholder = '\u00A0';
  @Input() public readonlyInput = true;
  @Output() public changeValue = new EventEmitter<[Date, Date]>();

  public _value: [Date, Date];

  @Input()
  public set value(dates: [Date | string, Date | string]) {
    if (dates[0] && dates[1]) {
      this._value = [moment(dates[0]).toDate(), moment(dates[1]).toDate()];
    }
  }

  public changeDate(dates: [Date, Date]) {
    if (dates[0] && dates[1]) {
      this.changeValue.emit(dates);
    }
  }

  public setPeriodDates(period: unitOfTime.DurationConstructor, previous = false) {
    const from = moment().startOf(period);
    let to = moment().endOf(period);

    if (previous) {
      from.subtract(1, period);
      to = from.clone().endOf(period);
    }

    this._value = [from.toDate(), to.toDate()];
    this.changeValue.emit(this._value);
    this.rangepicker.toggle();
  }

}
