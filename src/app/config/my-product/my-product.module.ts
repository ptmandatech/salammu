import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProductPageRoutingModule } from './my-product-routing.module';

import { MyProductPage } from './my-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProductPageRoutingModule
  ],
  declarations: [MyProductPage]
})
export class MyProductPageModule {}
