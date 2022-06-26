import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabangRantingPage } from './cabang-ranting.page';

const routes: Routes = [
  {
    path: '',
    component: CabangRantingPage
  },
  {
    path: 'detail-cabang-ranting/:cr/:id',
    loadChildren: () => import('./detail-cabang-ranting/detail-cabang-ranting.module').then( m => m.DetailCabangRantingPageModule)
  },
  {
    path: 'pencarian-cabangranting',
    loadChildren: () => import('./pencarian-cabangranting/pencarian-cabangranting.module').then( m => m.PencarianCabangrantingPageModule)
  },
  {
    path: 'tambah-cabang-ranting/:category/:id',
    loadChildren: () => import('./tambah-cabang-ranting/tambah-cabang-ranting.module').then( m => m.TambahCabangRantingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabangRantingPageRoutingModule {}
