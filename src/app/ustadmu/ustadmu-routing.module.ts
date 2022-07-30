import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UstadmuPage } from './ustadmu.page';

const routes: Routes = [
  {
    path: '',
    component: UstadmuPage
  },
  {
    path: 'detail-ustad',
    loadChildren: () => import('./detail-ustad/detail-ustad.module').then( m => m.DetailUstadPageModule)
  },
  {
    path: 'filter-ustad',
    loadChildren: () => import('./filter-ustad/filter-ustad.module').then( m => m.FilterUstadPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UstadmuPageRoutingModule {}
