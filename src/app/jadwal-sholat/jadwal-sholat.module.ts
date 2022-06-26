import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JadwalSholatPageRoutingModule } from './jadwal-sholat-routing.module';

import { JadwalSholatPage } from './jadwal-sholat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JadwalSholatPageRoutingModule
  ],
  declarations: [JadwalSholatPage]
})
export class JadwalSholatPageModule {}
