import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { OrderAddComponent } from './components/add/order-add.component';
import { OrderCardComponent } from './components/card/order-card.component';

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
  },
  {
    path: 'card/:id',
    component: OrderCardComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    OrderAddComponent,
    OrderCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderModule { }
