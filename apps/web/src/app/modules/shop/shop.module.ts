import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { ShopListComponent } from './components/list/shop-list.component';
import { ShopAddComponent } from './components/add/shop-add.component';
import { ShopFormComponent } from './dumbs/shop-form/shop-form.component';
import { ShopEditComponent } from './components/edit/shop-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ShopListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Магазины - CRM',
      roles: [RoleEnum.GENERAL_MANAGER],
      included: true
    }
  },
  {
    path: 'add',
    component: ShopAddComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Добавить магазин - CRM',
      roles: [RoleEnum.GENERAL_MANAGER],
      included: true
    }
  },
  {
    path: 'edit/:id',
    component: ShopEditComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    ShopListComponent,
    ShopAddComponent,
    ShopFormComponent,
    ShopEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ShopModule { }
