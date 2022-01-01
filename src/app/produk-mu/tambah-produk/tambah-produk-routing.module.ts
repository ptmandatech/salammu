import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahProdukPage } from './tambah-produk.page';

const routes: Routes = [
  {
    path: '',
    component: TambahProdukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahProdukPageRoutingModule {}
