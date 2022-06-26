import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahVideoPage } from './tambah-video.page';

const routes: Routes = [
  {
    path: '',
    component: TambahVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahVideoPageRoutingModule {}
