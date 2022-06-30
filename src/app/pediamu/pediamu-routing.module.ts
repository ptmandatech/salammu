import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PediamuPage } from './pediamu.page';

const routes: Routes = [
  {
    path: '',
    component: PediamuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PediamuPageRoutingModule {}
