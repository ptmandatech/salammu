import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailJadwalSholatPage } from './detail-jadwal-sholat.page';

const routes: Routes = [
  {
    path: '',
    component: DetailJadwalSholatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailJadwalSholatPageRoutingModule {}
