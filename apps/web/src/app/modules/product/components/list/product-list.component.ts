import { Component, OnInit } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { QueryParamsService } from "@crm/web/core/services/query-params.service";

/** Компонент показывает список товаров */
@Component({
  selector: 'crm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: []
})
export class ProductListComponent implements OnInit {

  /** Товары */
  public products: ProductDto[];

  /** Товары, которые видны в таблице */
  public showTableProducts: ProductDto[];

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

  /** Параметры адресной строки */
  public queryParams: Record<string, { value: any, toApi: boolean }> = {
    category: {
      value: [],
      toApi: true
    },
    code: {
      value: "",
      toApi: false
    },
    isArchive: {
      value: false,
      toApi: false
    }
  };

  /** Все фильтры */
  public filters = {
    categories: []
  };

  /** Выбранные фильтры */
  public selectedFilters = {
    categories: []
  }

  public constructor(private readonly productStateService: ProductStateService,
                     private readonly categoryStateService: CategoryStateService,
                     private readonly queryParamsService: QueryParamsService) {
  }

  public ngOnInit(): void {

    this.queryParams = this.queryParamsService.getFilteredQueryParams(this.queryParams);
    this.queryParamsService.setQueryParams(this.queryParams);

    this.categoryStateService.find<CategoryDto>().subscribe((categories) => {
      this.filters.categories = categories;
      this.selectedFilters = this.queryParamsService.getFilteredEntities(this.filters, this.queryParams);
      this.loadProducts();
    });
  }

  /** Функция загружает данные */
  public loadProducts() {
    this.loading = true;

    this.queryParamsService.setQueryParam(this.queryParams, 'category', this.selectedFilters.categories?.map((category) => category._id));

    this.productStateService.find<ProductDto>(this.queryParamsService.parseQueryParamsForApi(this.queryParams)).subscribe((products) => {
      this.products = products;
      this.showTableProducts = this.products;
      if (!this.queryParams['isArchive'].value) {
        this.showTableProducts = this.showTableProducts.filter((product) => !product.deleted);
      }
      this.showTableProducts = this.showTableProducts.filter((product) => product.code.includes(this.queryParams['code'].value));
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