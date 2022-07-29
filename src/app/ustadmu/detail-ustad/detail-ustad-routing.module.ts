import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailUstadPage } from './detail-ustad.page';

const routes: Routes = [
  {
    path: '',
    component: DetailUstadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailUstadPageRoutingModule {}
