import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlQuranPageRoutingModule } from './al-quran-routing.module';

import { AlQuranPage } from './al-quran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlQuranPageRoutingModule
  ],
  declarations: [AlQuranPage]
})
export class AlQuranPageModule {}
