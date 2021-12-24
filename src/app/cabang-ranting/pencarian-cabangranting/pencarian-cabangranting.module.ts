import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PencarianCabangrantingPageRoutingModule } from './pencarian-cabangranting-routing.module';

import { PencarianCabangrantingPage } from './pencarian-cabangranting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PencarianCabangrantingPageRoutingModule
  ],
  declarations: [PencarianCabangrantingPage]
})
export class PencarianCabangrantingPageModule {}
