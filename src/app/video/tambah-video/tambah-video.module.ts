import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahVideoPageRoutingModule } from './tambah-video-routing.module';

import { TambahVideoPage } from './tambah-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahVideoPageRoutingModule
  ],
  declarations: [TambahVideoPage]
})
export class TambahVideoPageModule {}
