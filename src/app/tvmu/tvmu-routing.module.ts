import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TvmuPage } from './tvmu.page';

const routes: Routes = [
  {
    path: '',
    component: TvmuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TvmuPageRoutingModule {}
