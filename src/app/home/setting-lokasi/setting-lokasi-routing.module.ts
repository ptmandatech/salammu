import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingLokasiPage } from './setting-lokasi.page';

const routes: Routes = [
  {
    path: '',
    component: SettingLokasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingLokasiPageRoutingModule {}
