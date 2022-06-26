import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailCabangRantingPageRoutingModule } from './detail-cabang-ranting-routing.module';

import { DetailCabangRantingPage } from './detail-cabang-ranting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailCabangRantingPageRoutingModule
  ],
  declarations: [DetailCabangRantingPage]
})
export class DetailCabangRantingPageModule {}
