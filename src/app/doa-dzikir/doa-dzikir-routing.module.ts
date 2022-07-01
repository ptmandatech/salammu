import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoaDzikirPage } from './doa-dzikir.page';

const routes: Routes = [
  {
    path: '',
    component: DoaDzikirPage
  },
  {
    path: 'detail-doa-dzikir',
    loadChildren: () => import('./detail-doa-dzikir/detail-doa-dzikir.module').then( m => m.DetailDoaDzikirPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoaDzikirPageRoutingModule {}
