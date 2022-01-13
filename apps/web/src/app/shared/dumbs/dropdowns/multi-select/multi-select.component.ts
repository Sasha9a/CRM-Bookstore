import { Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

/** Компонент модифицирующий стандартный множественный dropdown */
@Component({
  selector: 'crm-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: []
})
export class MultiSelectComponent implements OnChanges {

  public isNotNamedArray = false;

  @Input() public options: any[];
  @Input() public selectedItems: any[];
  @Output() public selectedItemsChange = new EventEmitter<any>();
  @Input() public dataKey = '_id';
  @Input() public placeholder = '\u00A0';
  @Input() public inputId = `${Math.random()}`;
  @Input() public label: string;
  @Input() public itemDescriptionField: string;
  @Input() public itemSubDescriptionField: string;
  @Input() public maxSelectedLabels = 2;
  @Input() public dropdownIcon = 'pi pi-chevron-down';
  @Input() public showHeader = true;
  @Input() public panelStyleClass: string;
  @Input() public optionLabel = 'name';
  @Input() public sort = this.optionLabel;
  @Input() public optionPrefix = null;
  @Input() public disabled = false;
  @Input() public group = false;
  @Input() public filterBy = 'name';
  @Input() public emptyFilterMessage = 'Нет результатов';
  @Input() public emptyMessage = 'Список пуст';
  @Input() public optionDisabled = 'inactive';
  @Input() public selectedItemsLabel = 'Выбрано: {0}';
  @Input() public selectedItemsOptions = { updateOn: 'default' };
  @Output() public changeValue = new EventEmitter<any>();
  @Output() public panelHide = new EventEmitter<any>();

  @Input() public class = '';

  @Input() public virtualScroll = false;
  @Input() public itemSize = 50;

  @ContentChild('itemTemplate', { static: false }) public itemTemplate;
  @ContentChild('selectedItemsTemplate', { static: false }) public selectedItemsTemplate;

  @Input() public isTemplateCombined = false;

  public replaceRegExp = /{[0-9]+}/g;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && Array.isArray(changes['options'].currentValue)) {
      this.setNamedValue(changes['options'].currentValue, 'options');
    }

    if (changes['selectedItems'] && Array.isArray(changes['selectedItems'].currentValue)) {
      this.setNamedValue(changes['selectedItems'].currentValue, 'selectedItems');
    }
  }

  public setNamedValue(items: string[] | number[], fieldToRewrite: 'options' | 'selectedItems') {
    if (typeof items[0] === 'string' || typeof items[0] === 'number') {
      this[fieldToRewrite] = items.map((item) => ({
        name: item,
        value: item
      }));
      this.isNotNamedArray = true;
    }
  }

  public onHideChangeValue() {
    this.selectedItemsChange.emit(this.selectedItems);
    this.changeValue.emit(this.selectedItems);
    this.panelHide.emit();
  }

  public onChangeValue(event: any) {
    if (this.isNotNamedArray) {
      const values = event.value.map((v) => v.value);
      this.changeValue.emit(values);
      this.selectedItemsChange.emit(values);
    } else {
      this.changeValue.emit(event.value);
      this.selectedItemsChange.emit(event.value);
    }
  }

}
