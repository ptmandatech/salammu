import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdukMUPageRoutingModule } from './produk-mu-routing.module';

import { ProdukMUPage } from './produk-mu.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdukMUPageRoutingModule,
    NgxIonicImageViewerModule,
    SwiperModule
  ],
  declarations: [ProdukMUPage]
})
export class ProdukMUPageModule {}
