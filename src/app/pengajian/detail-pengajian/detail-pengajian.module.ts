import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPengajianPageRoutingModule } from './detail-pengajian-routing.module';

import { DetailPengajianPage } from './detail-pengajian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPengajianPageRoutingModule
  ],
  declarations: [DetailPengajianPage]
})
export class DetailPengajianPageModule {}
