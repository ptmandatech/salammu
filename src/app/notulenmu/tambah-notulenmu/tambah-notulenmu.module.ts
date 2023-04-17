import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahNotulenmuPageRoutingModule } from './tambah-notulenmu-routing.module';

import { TambahNotulenmuPage } from './tambah-notulenmu.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [

        ] 
      }
    }),
    TambahNotulenmuPageRoutingModule
  ],
  declarations: [TambahNotulenmuPage]
})
export class TambahNotulenmuPageModule {}
