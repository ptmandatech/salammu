import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QiblaFinderPage } from './qibla-finder.page';

const routes: Routes = [
  {
    path: '',
    component: QiblaFinderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QiblaFinderPageRoutingModule {}
