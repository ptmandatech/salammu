import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahPengajianPageRoutingModule } from './tambah-pengajian-routing.module';

import { TambahPengajianPage } from './tambah-pengajian.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgSelectModule,
    TambahPengajianPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [TambahPengajianPage]
})
export class TambahPengajianPageModule {}
