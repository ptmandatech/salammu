import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahNotulenmuPage } from './tambah-notulenmu.page';

const routes: Routes = [
  {
    path: '',
    component: TambahNotulenmuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahNotulenmuPageRoutingModule {}
