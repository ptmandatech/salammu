import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSuratPageRoutingModule } from './detail-surat-routing.module';

import { DetailSuratPage } from './detail-surat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSuratPageRoutingModule
  ],
  declarations: [DetailSuratPage]
})
export class DetailSuratPageModule {}
