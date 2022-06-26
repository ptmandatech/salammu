import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPengajianPage } from './detail-pengajian.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPengajianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPengajianPageRoutingModule {}
