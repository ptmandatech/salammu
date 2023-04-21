import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilPageRoutingModule } from './edit-profil-routing.module';

import { EditProfilPage } from './edit-profil.page';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgSelectModule,
    EditProfilPageRoutingModule
  ],
  declarations: [EditProfilPage]
})
export class EditProfilPageModule {}
