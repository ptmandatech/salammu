import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PengajianPage } from './pengajian.page';

const routes: Routes = [
  {
    path: '',
    component: PengajianPage
  },
  {
    path: 'detail-pengajian',
    loadChildren: () => import('./detail-pengajian/detail-pengajian.module').then( m => m.DetailPengajianPageModule)
  },
  {
    path: 'tambah-pengajian',
    loadChildren: () => import('./tambah-pengajian/tambah-pengajian.module').then( m => m.TambahPengajianPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PengajianPageRoutingModule {}
