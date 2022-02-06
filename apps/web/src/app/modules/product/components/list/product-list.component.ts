import { Component, OnInit } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";

/** Компонент показывает список товаров */
@Component({
  selector: 'crm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: []
})
export class ProductListComponent implements OnInit {

  /** Товары */
  public products: ProductDto[];

  /** Список категорий */
  public categories: CategoryDto[];

  /** Грузится ли или нет */
  public loading = false;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { style: { 'width.px': '80' } },
    { label: 'Название', name: 'name', sort: 'name:string' },
    { label: 'Артикул', name: 'code', sort: 'code:string' },
    { label: 'Категория', name: 'category', sort: 'category.name:string' },
    { label: 'Цена', name: 'price', sort: 'price:number' },
    { label: 'Статус', name: 'deleted', sort: 'deleted:boolean' }
  ];

  public constructor(private readonly productStateService: ProductStateService,
                     private readonly categoryStateService: CategoryStateService) {
  }

  public ngOnInit(): void {
    this.categoryStateService.find<CategoryDto>().subscribe((categories) => this.categories = categories);
    this.loadProducts();
  }

  /** Функция загружает данные */
  public loadProducts() {
    this.loading = true;

    this.productStateService.find<ProductDto>().subscribe((products) => {
      this.products = products;
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param product товар
   * @return возвращает товар */
  public toProduct(product: any): ProductDto {
    return product as ProductDto;
  }

}
