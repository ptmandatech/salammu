import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListHadirPage } from './list-hadir.page';

const routes: Routes = [
  {
    path: '',
    component: ListHadirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListHadirPageRoutingModule {}
