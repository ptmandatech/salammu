import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVideoPage } from './my-video.page';

const routes: Routes = [
  {
    path: '',
    component: MyVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVideoPageRoutingModule {}
