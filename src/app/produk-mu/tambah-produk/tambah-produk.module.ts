import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahProdukPageRoutingModule } from './tambah-produk-routing.module';

import { TambahProdukPage } from './tambah-produk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahProdukPageRoutingModule,
  ],
  declarations: [TambahProdukPage]
})
export class TambahProdukPageModule {}
