import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotulenmuPage } from './notulenmu.page';

const routes: Routes = [
  {
    path: '',
    component: NotulenmuPage
  },
  {
    path: 'tambah-notulenmu/:id',
    loadChildren: () => import('./tambah-notulenmu/tambah-notulenmu.module').then( m => m.TambahNotulenmuPageModule)
  },
  {
    path: 'list-hadir/:id',
    loadChildren: () => import('./list-hadir/list-hadir.module').then( m => m.ListHadirPageModule)
  },
  {
    path: 'detail-notulenmu/:id',
    loadChildren: () => import('./detail-notulenmu/detail-notulenmu.module').then( m => m.DetailNotulenmuPageModule)
  },
  {
    path: 'tambah-peserta/:id',
    loadChildren: () => import('./tambah-peserta/tambah-peserta.module').then( m => m.TambahPesertaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotulenmuPageRoutingModule {}
