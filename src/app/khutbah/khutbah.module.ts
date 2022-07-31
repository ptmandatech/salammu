import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KhutbahPageRoutingModule } from './khutbah-routing.module';

import { KhutbahPage } from './khutbah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KhutbahPageRoutingModule
  ],
  declarations: [KhutbahPage]
})
export class KhutbahPageModule {}
