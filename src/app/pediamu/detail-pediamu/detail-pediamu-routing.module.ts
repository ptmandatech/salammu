import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPediamuPage } from './detail-pediamu.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPediamuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPediamuPageRoutingModule {}
