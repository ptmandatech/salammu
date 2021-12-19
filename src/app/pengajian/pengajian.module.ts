import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PengajianPageRoutingModule } from './pengajian-routing.module';

import { PengajianPage } from './pengajian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PengajianPageRoutingModule
  ],
  declarations: [PengajianPage]
})
export class PengajianPageModule {}
