import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailProdukPage } from './detail-produk.page';

const routes: Routes = [
  {
    path: '',
    component: DetailProdukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailProdukPageRoutingModule {}
