import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabangPage } from './cabang.page';

const routes: Routes = [
  {
    path: '',
    component: CabangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabangPageRoutingModule {}
