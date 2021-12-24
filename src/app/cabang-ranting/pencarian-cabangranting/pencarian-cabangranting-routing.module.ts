import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PencarianCabangrantingPage } from './pencarian-cabangranting.page';

const routes: Routes = [
  {
    path: '',
    component: PencarianCabangrantingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PencarianCabangrantingPageRoutingModule {}
