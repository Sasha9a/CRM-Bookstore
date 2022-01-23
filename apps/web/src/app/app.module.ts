import { CommonModule, registerLocaleData } from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "@crm/web/core/core.module";
import { ErrorInterceptor } from "@crm/web/core/interceptors/error.interceptor";
import { TokenInterceptor } from "@crm/web/core/interceptors/token.interceptor";
import { ShopModule } from "@crm/web/modules/shop/shop.module";
import { UserModule } from "@crm/web/modules/user/user.module";
import { SharedModule } from "@crm/web/shared/shared.module";

import { AppComponent } from './core/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import * as moment from 'moment-timezone';

registerLocaleData(localeRu, 'ru');
moment.locale('ru');

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    UserModule,
    ShopModule
  ],
  providers: [
    [
      { provide: LOCALE_ID, useValue: 'ru-RU' }
    ],
    [
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    [
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
