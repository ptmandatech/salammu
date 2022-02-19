import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CabangPageRoutingModule } from './cabang-routing.module';

import { CabangPage } from './cabang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CabangPageRoutingModule
  ],
  declarations: [CabangPage]
})
export class CabangPageModule {}
