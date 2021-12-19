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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PengajianPageRoutingModule {}
