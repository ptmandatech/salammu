import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PilihLokasiPageRoutingModule } from './pilih-lokasi-routing.module';

import { PilihLokasiPage } from './pilih-lokasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PilihLokasiPageRoutingModule
  ],
  declarations: [PilihLokasiPage]
})
export class PilihLokasiPageModule {}
