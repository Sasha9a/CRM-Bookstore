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
        path: '',
        loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('../modules/shop/shop.module').then(m => m.ShopModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../modules/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../modules/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'category',
        loadChildren: () => import('../modules/category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'product',
        loadChildren: () => import('../modules/product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'salary',
        loadChildren: () => import('../modules/salary/salary.module').then(m => m.SalaryModule)
      },
      {
        path: 'receipt',
        loadChildren: () => import('../modules/receipt/receipt.module').then(m => m.ReceiptModule)
      },
      {
        path: 'order',
        loadChildren: () => import('../modules/order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'traffic',
        loadChildren: () => import('../modules/traffic/traffic.module').then(m => m.TrafficModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('../modules/supplier/supplier.module').then(m => m.SupplierModule)
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
