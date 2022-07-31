import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailKhutbahPageRoutingModule } from './detail-khutbah-routing.module';

import { DetailKhutbahPage } from './detail-khutbah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailKhutbahPageRoutingModule
  ],
  declarations: [DetailKhutbahPage]
})
export class DetailKhutbahPageModule {}
