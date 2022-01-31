import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { CategoryListComponent } from './components/list/category-list.component';
import { CategoryAddComponent } from './components/add/category-add.component';
import { CategoryEditComponent } from './components/edit/category-edit.component';
import { CategoryFormComponent } from './dumbs/category-form/category-form.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Категории - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  },
  {
    path: 'add',
    component: CategoryAddComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Добавить категорию - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  },
  {
    path: 'edit/:id',
    component: CategoryEditComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryAddComponent,
    CategoryEditComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoryModule { }
