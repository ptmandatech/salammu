import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JadwalSholatPage } from './jadwal-sholat.page';

const routes: Routes = [
  {
    path: '',
    component: JadwalSholatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JadwalSholatPageRoutingModule {}
