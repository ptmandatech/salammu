import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyatTersimpanPageRoutingModule } from './ayat-tersimpan-routing.module';

import { AyatTersimpanPage } from './ayat-tersimpan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyatTersimpanPageRoutingModule
  ],
  declarations: [AyatTersimpanPage]
})
export class AyatTersimpanPageModule {}
