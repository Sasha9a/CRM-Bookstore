import { Component, Input } from '@angular/core';
import { CategoryFormDto } from "@crm/shared/dtos/category/category.form.dto";
import { CharacteristicDto } from "@crm/shared/dtos/category/characteristic.dto";
import { CharacteristicFormDto } from "@crm/shared/dtos/category/characteristic.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { validate } from "@crm/web/core/services/validation/validate.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";

/** Компонент ввода данных категории */
@Component({
  selector: 'crm-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent extends BaseFormComponent<CategoryFormDto> {

  /** Данные категории */
  @Input() public category = new CategoryFormDto();
  public dto = CategoryFormDto;

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  /** Данные характеристики который сейчас редактируется */
  public characteristicEdit: CharacteristicFormDto = new CharacteristicFormDto();

  public constructor(public override readonly errorService: ErrorService) {
    super(errorService);
  }

  /** Функция типизирует переменную
   * @param characteristic характеристика
   * @return возвращает характеристику */
  public toCharacteristic(characteristic: any): CharacteristicDto {
    return characteristic as CharacteristicDto;
  }

  /** Функция вызывается когда, меняется положение характеристики
   * @param event индексы которые поменялись местами */
  public rowReorder(event: { dragIndex: number, dropIndex: number }) {
    if (event.dragIndex === event.dropIndex) {
      return;
    }
    this.category.characteristics.forEach((c, index) => c.order = index);
  }

  /** Функция добавляет к категории характеристику */
  public addCharacteristic() {
    if (!Array.isArray(this.category.characteristics)) {
      this.category.characteristics = [];
    }
    const characteristic = new CharacteristicFormDto();
    characteristic.order = this.category.characteristics.length;
    this.characteristicEdit = characteristic;
    this.category.characteristics.push(characteristic);
  }

  /** Функция обновляет характеристику
   * @param characteristic характеристика */
  public updateCharacteristic(characteristic: CharacteristicDto) {
    this.characteristicEdit.order = characteristic.order;
    const { valid, errors } = validate(this.characteristicEdit, CharacteristicFormDto);
    if (!valid) {
      console.error(errors);
      this.errorService.errorValues<CharacteristicFormDto>(errors);
    } else {
      characteristic.name = this.characteristicEdit.name;
      this.characteristicEdit = null;
    }
  }

  /** Функция удаляет характеристику
   * @param characteristic характеристика */
  public deleteCharacteristic(characteristic: CharacteristicFormDto) {
    this.category.characteristics = this.category.characteristics.filter((c) => characteristic !== c);
  }

}
