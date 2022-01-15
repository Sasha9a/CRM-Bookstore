import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "@crm/web/core/app.component";
import { LoginComponent } from "@crm/web/modules/user/components/login/login.component";
import { SharedModule } from "@crm/web/shared/shared.module";
import { ConfirmationService, MessageService } from "primeng/api";

/** Массив URL маршрутов с настройками */
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Логин - CRM'
    }
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      scrollPositionRestoration: 'enabled'
    }),
    SharedModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class CoreModule { }
