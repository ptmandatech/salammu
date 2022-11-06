import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingLokasiPageRoutingModule } from './setting-lokasi-routing.module';

import { SettingLokasiPage } from './setting-lokasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingLokasiPageRoutingModule
  ],
  declarations: [SettingLokasiPage]
})
export class SettingLokasiPageModule {}
