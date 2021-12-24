import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabangRantingPage } from './cabang-ranting.page';

const routes: Routes = [
  {
    path: '',
    component: CabangRantingPage
  },
  {
    path: 'detail-cabang-ranting',
    loadChildren: () => import('./detail-cabang-ranting/detail-cabang-ranting.module').then( m => m.DetailCabangRantingPageModule)
  },
  {
    path: 'pencarian-cabangranting',
    loadChildren: () => import('./pencarian-cabangranting/pencarian-cabangranting.module').then( m => m.PencarianCabangrantingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabangRantingPageRoutingModule {}
