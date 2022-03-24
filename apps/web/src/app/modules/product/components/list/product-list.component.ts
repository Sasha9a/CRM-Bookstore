import { Component, OnInit } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { QueryParamsService } from "@crm/web/core/services/query-params.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { UtilsService } from "@crm/web/core/services/utils.service";

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
    { label: 'Количество', name: 'countShop', sort: 'countShop:number' },
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
  public filters: { categories: CategoryDto[], shops: ShopDto[] } = {
    categories: [],
    shops: []
  };

  /** Выбранные фильтры */
  public selectedFilters: { categories: CategoryDto[], shop: ShopDto } = {
    categories: [],
    shop: undefined
  }

  /** Запрещает ли менять фильтр смены магазина */
  public isNotChangeShop = true;

  public get RoleEnum() {
    return RoleEnum;
  }

  public constructor(private readonly productStateService: ProductStateService,
                     private readonly categoryStateService: CategoryStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly queryParamsService: QueryParamsService,
                     private readonly utilsService: UtilsService,
                     public readonly authService: AuthService) {
  }

  public ngOnInit(): void {

    this.queryParams = this.queryParamsService.getFilteredQueryParams(this.queryParams);
    this.queryParamsService.setQueryParams(this.queryParams);

    this.loading = true;

    this.categoryStateService.find<CategoryDto>().subscribe((categories) => {
      this.filters.categories = categories;
      this.selectedFilters.categories = this.utilsService.flattenCategory(this.filters.categories).filter((category) => {
        return this.queryParams['category'].value.some((id) => id === category._id);
      });
      this.loadProducts();
    });

    if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])) {
      this.shopStateService.findById<ShopDto>(this.authService.currentUser.shop?._id).subscribe((shop) => {
        this.filters.shops = [shop];
        if (this.authService.currentUser.shop) {
          this.selectedFilters.shop = shop;
          this.updateCountProducts();
        }
      });
    } else {
      this.shopStateService.find<ShopDto>().subscribe((shops) => {
        this.filters.shops = shops;
        if (this.authService.currentUser.shop) {
          this.selectedFilters.shop = this.filters.shops.find((shop) => shop._id === this.authService.currentUser.shop._id);
          this.updateCountProducts();
        }
        this.isNotChangeShop = false;
      });
    }
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
      this.updateCountProducts();
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Обновляет кол-во товара для отображения на таблице */
  public updateCountProducts() {
    this.showTableProducts?.forEach((product) => {
      product['countShop'] = (product.count && this.selectedFilters.shop) ? product.count[this.selectedFilters.shop._id] : 0;
    });
    if (this.showTableProducts) {
      this.showTableProducts = [...this.showTableProducts];
    }
  }

  /** Функция типизирует переменную
   * @param product товар
   * @return возвращает товар */
  public toProduct(product: any): ProductDto {
    return product as ProductDto;
  }

}
