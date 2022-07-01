import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PediamuPage } from './pediamu.page';

const routes: Routes = [
  {
    path: '',
    component: PediamuPage
  },
  {
    path: 'detail-pediamu',
    loadChildren: () => import('./detail-pediamu/detail-pediamu.module').then( m => m.DetailPediamuPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PediamuPageRoutingModule {}
