import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SicaraPage } from './sicara.page';

const routes: Routes = [
  {
    path: '',
    component: SicaraPage
  },
  {
    path: 'daerah/:id',
    loadChildren: () => import('./daerah/daerah.module').then( m => m.DaerahPageModule)
  },
  {
    path: 'cabang/:id',
    loadChildren: () => import('./cabang/cabang.module').then( m => m.CabangPageModule)
  },
  {
    path: 'ranting/:id',
    loadChildren: () => import('./ranting/ranting.module').then( m => m.RantingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SicaraPageRoutingModule {}
