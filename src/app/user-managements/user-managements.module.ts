import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserManagementsPageRoutingModule } from './user-managements-routing.module';

import { UserManagementsPage } from './user-managements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManagementsPageRoutingModule
  ],
  declarations: [UserManagementsPage]
})
export class UserManagementsPageModule {}
