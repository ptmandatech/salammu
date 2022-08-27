import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RadiomuPageRoutingModule } from './radiomu-routing.module';

import { RadiomuPage } from './radiomu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RadiomuPageRoutingModule
  ],
  declarations: [RadiomuPage]
})
export class RadiomuPageModule {}
