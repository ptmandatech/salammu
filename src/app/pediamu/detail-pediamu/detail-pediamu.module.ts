import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPediamuPageRoutingModule } from './detail-pediamu-routing.module';

import { DetailPediamuPage } from './detail-pediamu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPediamuPageRoutingModule
  ],
  declarations: [DetailPediamuPage]
})
export class DetailPediamuPageModule {}
