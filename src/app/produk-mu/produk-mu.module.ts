import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdukMUPageRoutingModule } from './produk-mu-routing.module';

import { ProdukMUPage } from './produk-mu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdukMUPageRoutingModule
  ],
  declarations: [ProdukMUPage]
})
export class ProdukMUPageModule {}
