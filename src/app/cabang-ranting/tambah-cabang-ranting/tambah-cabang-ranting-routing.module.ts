import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahCabangRantingPage } from './tambah-cabang-ranting.page';

const routes: Routes = [
  {
    path: '',
    component: TambahCabangRantingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahCabangRantingPageRoutingModule {}
