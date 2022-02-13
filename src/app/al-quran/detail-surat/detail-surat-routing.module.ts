import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSuratPage } from './detail-surat.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSuratPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSuratPageRoutingModule {}
