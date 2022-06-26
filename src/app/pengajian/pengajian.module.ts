import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PengajianPageRoutingModule } from './pengajian-routing.module';

import { PengajianPage } from './pengajian.page';
import { Geolocation, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PengajianPageRoutingModule
  ],
  declarations: [PengajianPage],
  providers: [Geolocation]
})
export class PengajianPageModule {}
