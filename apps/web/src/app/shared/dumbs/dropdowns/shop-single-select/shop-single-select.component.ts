import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";

/** Компонент выбора магазина */
@Component({
  selector: 'crm-shop-single-select',
  templateUrl: './shop-single-select.component.html',
  styleUrls: []
})
export class ShopSingleSelectComponent {

  @Input() public shops: ShopDto[] = [];

  @Input() public selectedShop: ShopDto | Partial<ShopDto>;
  @Output() public selectedShopChange = new EventEmitter<ShopDto>();

  @Input() public virtualScroll = false;
  @Input() public itemSize = 47;

  @Input() public labelInput = '';
  @Input() public placeholder = '\u00A0';

  @Input() public class = '';

  @Input() public disabled = false;

  public toShop(shop: any): ShopDto {
    return shop as ShopDto;
  }

}
