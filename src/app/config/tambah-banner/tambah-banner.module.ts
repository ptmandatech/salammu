import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahBannerPageRoutingModule } from './tambah-banner-routing.module';

import { TambahBannerPage } from './tambah-banner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahBannerPageRoutingModule
  ],
  declarations: [TambahBannerPage]
})
export class TambahBannerPageModule {}
