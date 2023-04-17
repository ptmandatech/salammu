import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotulenmuPageRoutingModule } from './notulenmu-routing.module';

import { NotulenmuPage } from './notulenmu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotulenmuPageRoutingModule
  ],
  declarations: [NotulenmuPage]
})
export class NotulenmuPageModule {}
