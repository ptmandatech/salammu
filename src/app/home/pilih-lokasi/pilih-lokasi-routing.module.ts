import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PilihLokasiPage } from './pilih-lokasi.page';

const routes: Routes = [
  {
    path: '',
    component: PilihLokasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PilihLokasiPageRoutingModule {}
