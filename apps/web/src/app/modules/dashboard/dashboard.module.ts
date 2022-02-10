import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Рабочий стол - CRM',
      roles: [RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR],
      included: true
    }
  }
];


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
