import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaerahPage } from './daerah.page';

const routes: Routes = [
  {
    path: '',
    component: DaerahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaerahPageRoutingModule {}
