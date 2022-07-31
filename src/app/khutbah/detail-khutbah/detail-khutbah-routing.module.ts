import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailKhutbahPage } from './detail-khutbah.page';

const routes: Routes = [
  {
    path: '',
    component: DetailKhutbahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailKhutbahPageRoutingModule {}
