import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoaDzikirPageRoutingModule } from './doa-dzikir-routing.module';

import { DoaDzikirPage } from './doa-dzikir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoaDzikirPageRoutingModule
  ],
  declarations: [DoaDzikirPage]
})
export class DoaDzikirPageModule {}
