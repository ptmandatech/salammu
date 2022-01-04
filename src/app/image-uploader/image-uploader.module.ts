import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageUploaderPageRoutingModule } from './image-uploader-routing.module';

import { ImageUploaderPage } from './image-uploader.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageUploaderPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [ImageUploaderPage]
})
export class ImageUploaderPageModule {}
