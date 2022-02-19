import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RantingPageRoutingModule } from './ranting-routing.module';

import { RantingPage } from './ranting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RantingPageRoutingModule
  ],
  declarations: [RantingPage]
})
export class RantingPageModule {}
