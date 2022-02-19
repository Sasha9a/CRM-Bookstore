import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { RoleGuard } from "@crm/web/core/guards/role.guard";
import { SharedModule } from "@crm/web/shared/shared.module";
import { TrafficAddComponent } from './components/add/traffic-add.component';

const routes: Routes = [
  {
    path: 'add',
    component: TrafficAddComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Добавить трафик - CRM',
      roles: [RoleEnum.GENERAL_MANAGER],
      included: true
    }
  }
];

@NgModule({
  declarations: [
    TrafficAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TrafficModule { }
