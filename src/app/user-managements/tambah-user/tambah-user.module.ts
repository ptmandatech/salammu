import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahUserPageRoutingModule } from './tambah-user-routing.module';

import { TambahUserPage } from './tambah-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahUserPageRoutingModule
  ],
  declarations: [TambahUserPage]
})
export class TambahUserPageModule {}
