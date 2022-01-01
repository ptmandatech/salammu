import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVideoPageRoutingModule } from './my-video-routing.module';

import { MyVideoPage } from './my-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVideoPageRoutingModule
  ],
  declarations: [MyVideoPage]
})
export class MyVideoPageModule {}
