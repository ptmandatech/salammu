import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailDoaDzikirPageRoutingModule } from './detail-doa-dzikir-routing.module';

import { DetailDoaDzikirPage } from './detail-doa-dzikir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailDoaDzikirPageRoutingModule
  ],
  declarations: [DetailDoaDzikirPage]
})
export class DetailDoaDzikirPageModule {}
