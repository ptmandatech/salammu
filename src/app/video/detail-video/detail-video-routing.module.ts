import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailVideoPage } from './detail-video.page';

const routes: Routes = [
  {
    path: '',
    component: DetailVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailVideoPageRoutingModule {}
