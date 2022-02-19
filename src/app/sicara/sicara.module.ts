import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SicaraPageRoutingModule } from './sicara-routing.module';

import { SicaraPage } from './sicara.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SicaraPageRoutingModule
  ],
  declarations: [SicaraPage]
})
export class SicaraPageModule {}
