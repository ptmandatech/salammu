import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KhutbahPage } from './khutbah.page';

const routes: Routes = [
  {
    path: '',
    component: KhutbahPage
  },
  {
    path: 'detail-khutbah',
    loadChildren: () => import('./detail-khutbah/detail-khutbah.module').then( m => m.DetailKhutbahPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KhutbahPageRoutingModule {}
