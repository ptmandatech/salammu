import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPengajianPage } from './my-pengajian.page';

const routes: Routes = [
  {
    path: '',
    component: MyPengajianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPengajianPageRoutingModule {}
