import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "@crm/web/core/app.component";
import { AuthGuard } from "@crm/web/core/guards/auth.guard";
import { LoginComponent } from "@crm/web/modules/user/components/login/login.component";
import { CommonLayoutComponent } from "@crm/web/shared/layouts/common-layout/common-layout.component";
import { SharedModule } from "@crm/web/shared/shared.module";
import { ConfirmationService, MessageService } from "primeng/api";

/** Массив URL маршрутов с настройками */
const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'shop',
        loadChildren: () => import('../modules/shop/shop.module').then(m => m.ShopModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Логин - CRM'
    }
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    redirectTo: ''
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
