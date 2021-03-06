import { Pipe, PipeTransform } from '@angular/core';
import { PaymentTypeEnum } from "@crm/shared/enums/payment.type.enum";

const paymentTypeName = {
  [PaymentTypeEnum.CASH]: 'Наличными',
  [PaymentTypeEnum.CASHLESS]: 'Безналичными',
  [PaymentTypeEnum.ADJACENT]: 'Смежная оплата'
};

/** Пайп конвертирует enum в человеческое название способа оплаты */
@Pipe({
  name: 'paymentTypeName'
})
export class PaymentTypeNamePipe implements PipeTransform {

  public transform(value: PaymentTypeEnum): string {
    return paymentTypeName[value] || '';
  }

}
