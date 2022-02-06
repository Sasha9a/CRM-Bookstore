import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './dumbs/product-form/product-form.component';
import { ProductAddComponent } from './components/add/product-add.component';
import { ProductEditComponent } from './components/edit/product-edit.component';
import { ProductListComponent } from './components/list/product-list.component';



@NgModule({
  declarations: [
    ProductFormComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProductModule { }
