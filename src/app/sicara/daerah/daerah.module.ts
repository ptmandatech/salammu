import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaerahPageRoutingModule } from './daerah-routing.module';

import { DaerahPage } from './daerah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaerahPageRoutingModule
  ],
  declarations: [DaerahPage]
})
export class DaerahPageModule {}
