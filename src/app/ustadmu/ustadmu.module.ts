import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UstadmuPageRoutingModule } from './ustadmu-routing.module';

import { UstadmuPage } from './ustadmu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UstadmuPageRoutingModule
  ],
  declarations: [UstadmuPage]
})
export class UstadmuPageModule {}
