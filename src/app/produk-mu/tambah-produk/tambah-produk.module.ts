import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahProdukPageRoutingModule } from './tambah-produk-routing.module';

import { TambahProdukPage } from './tambah-produk.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [

        ] 
      }
    }),
    TambahProdukPageRoutingModule,
  ],
  declarations: [TambahProdukPage]
})
export class TambahProdukPageModule {}
