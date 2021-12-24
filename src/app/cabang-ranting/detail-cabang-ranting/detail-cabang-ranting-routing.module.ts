import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailCabangRantingPage } from './detail-cabang-ranting.page';

const routes: Routes = [
  {
    path: '',
    component: DetailCabangRantingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailCabangRantingPageRoutingModule {}
