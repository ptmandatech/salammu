import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahPengajianPageRoutingModule } from './tambah-pengajian-routing.module';

import { TambahPengajianPage } from './tambah-pengajian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahPengajianPageRoutingModule
  ],
  declarations: [TambahPengajianPage]
})
export class TambahPengajianPageModule {}
