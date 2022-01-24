import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/list/user-list.component';
import { UserAddComponent } from './components/add/user-add.component';
import { UserEditComponent } from './components/edit/user-edit.component';
import { UserCardComponent } from './components/card/user-card.component';
import { UserCreateFormComponent } from './dumbs/user-create-form/user-create-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Сотрудники - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  },
  {
    path: 'add',
    component: UserAddComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Добавить сотрудника - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  },
  {
    path: 'edit/:id',
    component: UserEditComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  },
  {
    path: 'card/:id',
    component: UserCardComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserCardComponent,
    UserCreateFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
