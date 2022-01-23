import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Компонент модифицирующий стандартный ввод дат */
@Component({
  selector: 'crm-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: []
})
export class DatepickerComponent {

  public _value: Date;

  public _minDate: Date;
  public _maxDate: Date;

  @Input()
  public set value(date: Date | string) {
    if (date) {
      this._value = new Date(date);
    }
  }

  @Input()
  public set minDate(date: Date | string) {
    if (date) {
      this._minDate = new Date(date);
    }
  }

  @Input()
  public set maxDate(date: Date | string) {
    if (date) {
      this._maxDate = new Date(date);
    }
  }

  @Output() public valueChange = new EventEmitter<Date>();

  @Input() public class: string;
  @Input() public modelOptions: any;
  @Input() public showButtonBar = false;
  @Input() public dateFormat = 'dd.mm.yy';
  @Input() public defaultDate: Date = new Date();
  @Input() public monthNavigator: boolean;
  @Input() public yearNavigator: boolean;
  @Input() public yearRange: string;
  @Input() public readonlyInput = true;
  @Input() public placeholder: string;
  @Input() public styleClass: string;
  @Input() public inputStyleClass: string;
  @Input() public timeOnly = false;
  @Input() public showTime = false;

}
