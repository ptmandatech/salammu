import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailRadioPage } from './detail-radio.page';

const routes: Routes = [
  {
    path: '',
    component: DetailRadioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRadioPageRoutingModule {}
