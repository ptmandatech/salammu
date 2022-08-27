import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TanyaUstadPageRoutingModule } from './tanya-ustad-routing.module';

import { TanyaUstadPage } from './tanya-ustad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TanyaUstadPageRoutingModule
  ],
  declarations: [TanyaUstadPage]
})
export class TanyaUstadPageModule {}
