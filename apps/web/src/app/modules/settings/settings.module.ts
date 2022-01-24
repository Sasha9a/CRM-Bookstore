import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@crm/web/shared/shared.module";
import { SettingsComponent } from './components/settings/settings.component';
import { UserPasswordFormComponent } from '../settings/dumbs/user-password-form/user-password-form.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      title: 'Персональные настройки - CRM'
    }
  },
];

@NgModule({
  declarations: [
    SettingsComponent,
    UserPasswordFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
