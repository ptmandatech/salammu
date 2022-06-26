import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahBannerPage } from './tambah-banner.page';

const routes: Routes = [
  {
    path: '',
    component: TambahBannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahBannerPageRoutingModule {}
