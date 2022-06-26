import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCrPageRoutingModule } from './my-cr-routing.module';

import { MyCrPage } from './my-cr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCrPageRoutingModule
  ],
  declarations: [MyCrPage]
})
export class MyCrPageModule {}
