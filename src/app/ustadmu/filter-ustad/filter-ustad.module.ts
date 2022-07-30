import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterUstadPageRoutingModule } from './filter-ustad-routing.module';

import { FilterUstadPage } from './filter-ustad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterUstadPageRoutingModule
  ],
  declarations: [FilterUstadPage]
})
export class FilterUstadPageModule {}
