import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtikelPage } from './artikel.page';

const routes: Routes = [
  {
    path: '',
    component: ArtikelPage
  },
  {
    path: 'detail-artikel',
    loadChildren: () => import('./detail-artikel/detail-artikel.module').then( m => m.DetailArtikelPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtikelPageRoutingModule {}
