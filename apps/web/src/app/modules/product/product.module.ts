import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@crm/web/shared/shared.module";
import { ProductFormComponent } from './dumbs/product-form/product-form.component';
import { ProductAddComponent } from './components/add/product-add.component';
import { ProductEditComponent } from './components/edit/product-edit.component';
import { ProductListComponent } from './components/list/product-list.component';
import { ProductCardComponent } from './components/card/product-card.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    data: {
      title: 'Товары - CRM'
    }
  },
  {
    path: 'add',
    component: ProductAddComponent,
    data: {
      title: 'Создать товар - CRM'
    }
  },
  {
    path: 'card/:id',
    component: ProductCardComponent
  },
  {
    path: 'edit/:id',
    component: ProductEditComponent
  }
];

@NgModule({
  declarations: [
    ProductFormComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductListComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductModule { }
