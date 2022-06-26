import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPengajianPageRoutingModule } from './my-pengajian-routing.module';

import { MyPengajianPage } from './my-pengajian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPengajianPageRoutingModule
  ],
  declarations: [MyPengajianPage]
})
export class MyPengajianPageModule {}
