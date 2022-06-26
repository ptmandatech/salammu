import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CabangRantingPageRoutingModule } from './cabang-ranting-routing.module';

import { CabangRantingPage } from './cabang-ranting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CabangRantingPageRoutingModule
  ],
  declarations: [CabangRantingPage]
})
export class CabangRantingPageModule {}
