import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahPesertaPageRoutingModule } from './tambah-peserta-routing.module';

import { TambahPesertaPage } from './tambah-peserta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahPesertaPageRoutingModule
  ],
  declarations: [TambahPesertaPage]
})
export class TambahPesertaPageModule {}
