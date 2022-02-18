import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { OrderAddComponent } from './components/order-add/order-add.component';

const routes: Routes = [
  {
    path: 'add',
    component: OrderAddComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Добавить заказ - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    OrderAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderModule { }
