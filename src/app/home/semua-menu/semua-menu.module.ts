import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SemuaMenuPageRoutingModule } from './semua-menu-routing.module';

import { SemuaMenuPage } from './semua-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SemuaMenuPageRoutingModule
  ],
  declarations: [SemuaMenuPage]
})
export class SemuaMenuPageModule {}
