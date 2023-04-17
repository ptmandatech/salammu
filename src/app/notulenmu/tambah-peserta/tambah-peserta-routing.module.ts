import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahPesertaPage } from './tambah-peserta.page';

const routes: Routes = [
  {
    path: '',
    component: TambahPesertaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahPesertaPageRoutingModule {}
