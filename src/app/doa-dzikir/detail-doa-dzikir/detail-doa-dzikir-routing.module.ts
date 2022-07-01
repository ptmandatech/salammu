import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailDoaDzikirPage } from './detail-doa-dzikir.page';

const routes: Routes = [
  {
    path: '',
    component: DetailDoaDzikirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailDoaDzikirPageRoutingModule {}
