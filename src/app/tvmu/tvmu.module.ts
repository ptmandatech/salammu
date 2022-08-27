import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TvmuPageRoutingModule } from './tvmu-routing.module';

import { TvmuPage } from './tvmu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TvmuPageRoutingModule
  ],
  declarations: [TvmuPage]
})
export class TvmuPageModule {}
