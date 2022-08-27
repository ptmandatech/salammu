import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailRadioPageRoutingModule } from './detail-radio-routing.module';

import { DetailRadioPage } from './detail-radio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailRadioPageRoutingModule
  ],
  declarations: [DetailRadioPage]
})
export class DetailRadioPageModule {}
