import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { SupplierAddComponent } from './components/add/supplier-add.component';
import { SupplierEditComponent } from './components/edit/supplier-edit.component';
import { SupplierListComponent } from './components/list/supplier-list.component';
import { SupplierFormComponent } from './dumbs/supplier-form/supplier-form.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Поставщики - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  },
  {
    path: 'add',
    component: SupplierAddComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Добавить поставщика - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  },
  {
    path: 'edit/:id',
    component: SupplierEditComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    SupplierAddComponent,
    SupplierEditComponent,
    SupplierListComponent,
    SupplierFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SupplierModule { }
