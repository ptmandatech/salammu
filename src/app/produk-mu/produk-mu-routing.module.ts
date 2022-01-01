import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdukMUPage } from './produk-mu.page';

const routes: Routes = [
  {
    path: '',
    component: ProdukMUPage
  },
  {
    path: 'detail-produk',
    loadChildren: () => import('./detail-produk/detail-produk.module').then( m => m.DetailProdukPageModule)
  },
  {
    path: 'tambah-produk',
    loadChildren: () => import('./tambah-produk/tambah-produk.module').then( m => m.TambahProdukPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdukMUPageRoutingModule {}
