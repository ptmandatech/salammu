import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListHadirPageRoutingModule } from './list-hadir-routing.module';

import { ListHadirPage } from './list-hadir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListHadirPageRoutingModule
  ],
  declarations: [ListHadirPage]
})
export class ListHadirPageModule {}
