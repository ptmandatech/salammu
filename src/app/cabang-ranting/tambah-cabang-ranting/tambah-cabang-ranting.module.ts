import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahCabangRantingPageRoutingModule } from './tambah-cabang-ranting-routing.module';

import { TambahCabangRantingPage } from './tambah-cabang-ranting.page';
import { QuillModule } from 'ngx-quill';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahCabangRantingPageRoutingModule,
    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [

        ] 
      }
    }),
  ],
  declarations: [TambahCabangRantingPage]
})
export class TambahCabangRantingPageModule {}
