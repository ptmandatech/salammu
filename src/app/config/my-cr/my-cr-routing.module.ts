import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCrPage } from './my-cr.page';

const routes: Routes = [
  {
    path: '',
    component: MyCrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCrPageRoutingModule {}
