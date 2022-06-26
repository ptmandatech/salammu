import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TafsirSuratPageRoutingModule } from './tafsir-surat-routing.module';

import { TafsirSuratPage } from './tafsir-surat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TafsirSuratPageRoutingModule
  ],
  declarations: [TafsirSuratPage]
})
export class TafsirSuratPageModule {}
