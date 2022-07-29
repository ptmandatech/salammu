import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailUstadPageRoutingModule } from './detail-ustad-routing.module';

import { DetailUstadPage } from './detail-ustad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailUstadPageRoutingModule
  ],
  declarations: [DetailUstadPage]
})
export class DetailUstadPageModule {}
