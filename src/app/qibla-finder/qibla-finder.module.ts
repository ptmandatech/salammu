import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QiblaFinderPageRoutingModule } from './qibla-finder-routing.module';

import { QiblaFinderPage } from './qibla-finder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QiblaFinderPageRoutingModule
  ],
  declarations: [QiblaFinderPage]
})
export class QiblaFinderPageModule {}
