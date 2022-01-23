import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";

@Component({
  selector: 'crm-shop-multi-select',
  templateUrl: './shop-multi-select.component.html',
  styleUrls: []
})
export class ShopMultiSelectComponent {

  @Input() public shops: ShopDto[] = [];

  @Input() public selectedShops: ShopDto[] = [];
  @Output() public selectedShopsChange = new EventEmitter<ShopDto[]>();

  @Input() public labelInput = false;

  public toShop(shop: any): ShopDto {
    return shop as ShopDto;
  }

}
