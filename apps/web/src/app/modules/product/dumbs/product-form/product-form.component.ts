import { Component, Input, ViewChild } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductFormDto } from "@crm/shared/dtos/product/product.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { FileService } from "@crm/web/core/services/file.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";
import { FileUpload } from "primeng/fileupload";

/** Компонент ввода данных товара */
@Component({
  selector: 'crm-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent extends BaseFormComponent<ProductFormDto> {

  /** Данные товара */
  @Input() public product = new ProductFormDto();
  public dto = ProductFormDto;

  /** Список всех категорий и подкатегорий */
  @Input() public categories: CategoryDto[];

  /** Список всех магазинов */
  @Input() public shops: ShopDto[];

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  /** Кнопка загрузки картинки */
  @ViewChild('fileUpload') public fileUpload: FileUpload;

  public constructor(public override readonly errorService: ErrorService,
                     private readonly fileService: FileService) {
    super(errorService);
  }

  /** Загрузка новой картинки
   * @param data файл */
  public imageSave(data: { files: FileList }) {
    this.fileService.upload(data.files).subscribe((files) => {
      this.product.image = files[0];
      this.fileUpload.clear();
    }, () => this.fileUpload.clear());
  }

}
