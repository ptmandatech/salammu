import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailProdukPageRoutingModule } from './detail-produk-routing.module';

import { DetailProdukPage } from './detail-produk.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailProdukPageRoutingModule,
    NgxIonicImageViewerModule,
    SwiperModule
  ],
  declarations: [DetailProdukPage]
})
export class DetailProdukPageModule {}
