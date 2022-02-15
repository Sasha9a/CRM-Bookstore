import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { ReceiptAddComponent } from './components/add/receipt-add.component';
import { ReceiptCardComponent } from './components/card/receipt-card.component';

const routes: Routes = [
  {
    path: 'add',
    component: ReceiptAddComponent,
    data: {
      title: 'Добавить чек - CRM'
    }
  },
  {
    path: 'card/:id',
    component: ReceiptCardComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    ReceiptAddComponent,
    ReceiptCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ReceiptModule { }
