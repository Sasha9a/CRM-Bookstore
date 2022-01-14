import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "@crm/web/core/core.module";
import { ErrorInterceptor } from "@crm/web/core/interceptors/error.interceptor";
import { TokenInterceptor } from "@crm/web/core/interceptors/token.interceptor";
import { SharedModule } from "@crm/web/shared/shared.module";

import { AppComponent } from './core/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import * as moment from 'moment-timezone';

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
    SharedModule
  ],
  providers: [
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
