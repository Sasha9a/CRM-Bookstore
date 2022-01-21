import { Component, OnInit } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";

@Component({
  selector: 'crm-list',
  templateUrl: './shop-list.component.html',
  styleUrls: []
})
export class ShopListComponent implements OnInit {

  public shops: ShopDto[];
  public loading = false;

  public itemColumns: CrmTableColumn[] = [
    { label: 'Адрес', name: 'address', sort: 'address:string' },
    { label: 'Метро', name: 'metro', sort: 'metro:string' },
    { label: 'Режим работы', name: 'openingHours', sort: 'openingHours:string' }
  ];

  public constructor(private readonly shopStateService: ShopStateService) { }

  public ngOnInit(): void {
    this.loadShops();
  }

  public loadShops() {
    this.loading = true;

    this.shopStateService.find<ShopDto>().subscribe((data) => {
      this.shops = data;
      this.loading = false;
    }, () => this.loading = false);
  }

  public toShop(shop: any): ShopDto {
    return shop as ShopDto;
  }

}
