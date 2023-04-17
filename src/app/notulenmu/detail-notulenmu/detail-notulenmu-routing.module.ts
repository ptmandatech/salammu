import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailNotulenmuPage } from './detail-notulenmu.page';

const routes: Routes = [
  {
    path: '',
    component: DetailNotulenmuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailNotulenmuPageRoutingModule {}
