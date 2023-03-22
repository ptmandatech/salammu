import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailJadwalSholatPageRoutingModule } from './detail-jadwal-sholat-routing.module';

import { DetailJadwalSholatPage } from './detail-jadwal-sholat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailJadwalSholatPageRoutingModule
  ],
  declarations: [DetailJadwalSholatPage]
})
export class DetailJadwalSholatPageModule {}
