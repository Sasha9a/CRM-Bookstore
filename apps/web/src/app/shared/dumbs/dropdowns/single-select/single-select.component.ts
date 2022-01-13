import { ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Dropdown } from "primeng/dropdown";

/** Компонент модифицирующий стандартный dropdown */
@Component({
  selector: 'crm-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements OnInit, OnChanges {

  public isNotNamedArray = false;

  @Input() public changeValueOptions: any;
  @Input() public class: string;
  @Input() public dataKey = '_id';
  @Input() public disabled = false;
  @Input() public editValue = 'name';
  @Input() public editable = false;
  @Input() public emptyFilterMessage = 'Нет результатов';
  @Input() public emptyMessage = 'Список пуст';
  @Input() public errorMessage: string;
  @Input() public filter = true;
  @Input() public filterBy = 'name';
  @Input() public inputId = `${Math.random()}`;
  @Input() public itemDescriptionField: string;
  @Input() public itemSubDescriptionField: string;
  @Input() public label: string;
  @Input() public optionLabel = 'name';
  @Input() public options: any[];
  @Input() public placeholder = '\u00A0';
  @Input() public selectedItem: any;
  @Input() public showClear = false;
  @Input() public sort = this.optionLabel;
  @Input() public styleClass: any;
  @Output() public changeValue = new EventEmitter<any>();
  @Output() public selectedItemChange = new EventEmitter<any>();
  @ViewChild('select') public dropdown: Dropdown;

  @Input() public virtualScroll = false;
  @Input() public itemSize: number;

  @ContentChild('itemTemplate', { static: false }) public itemTemplate;
  @ContentChild('selectedItemTemplate', { static: false }) public selectedItemTemplate;

  @Input() public isTemplateCombined = false;

  public constructor(private chRef: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    if (this.options?.length && (typeof this.options[0] === 'string' || typeof this.options[0] === 'number')) {
      this.options = this.options.map((option) => (
        {
          name: option,
          value: option
        }
      ));
      this.isNotNamedArray = true;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.editable) {
      this.chRef.detectChanges();
      this.dropdown.editableInputViewChild.nativeElement.value = this.editValue;
    }

    if (changes['selectedItem']) {
      if (typeof changes['selectedItem'].currentValue === 'string' || typeof changes['selectedItem'].currentValue === 'number') {
        this.selectedItem = {
          name: changes['selectedItem'].currentValue,
          value: changes['selectedItem'].currentValue
        };
      }
    }
  }

  public onChangeValue(event: any) {
    this.errorMessage = null;
    this.class = null;
    if (this.isNotNamedArray) {
      this.changeValue.emit(event.value.value);
      this.selectedItemChange.emit(event.value.value);
    } else {
      this.changeValue.emit(event.value);
      this.selectedItemChange.emit(event.value);
    }
  }

  public showPanel() {
    this.dropdown.show();
  }

  public hidePanel() {
    this.dropdown.hide();
  }

}
