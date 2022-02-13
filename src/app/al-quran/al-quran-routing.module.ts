import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlQuranPage } from './al-quran.page';

const routes: Routes = [
  {
    path: '',
    component: AlQuranPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlQuranPageRoutingModule {}
