import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailVideoPageRoutingModule } from './detail-video-routing.module';

import { DetailVideoPage } from './detail-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailVideoPageRoutingModule
  ],
  declarations: [DetailVideoPage]
})
export class DetailVideoPageModule {}
