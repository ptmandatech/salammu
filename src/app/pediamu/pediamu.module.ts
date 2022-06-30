import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PediamuPageRoutingModule } from './pediamu-routing.module';

import { PediamuPage } from './pediamu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PediamuPageRoutingModule
  ],
  declarations: [PediamuPage]
})
export class PediamuPageModule {}
