import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailNotulenmuPageRoutingModule } from './detail-notulenmu-routing.module';

import { DetailNotulenmuPage } from './detail-notulenmu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailNotulenmuPageRoutingModule
  ],
  declarations: [DetailNotulenmuPage]
})
export class DetailNotulenmuPageModule {}
