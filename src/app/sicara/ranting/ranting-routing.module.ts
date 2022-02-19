import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RantingPage } from './ranting.page';

const routes: Routes = [
  {
    path: '',
    component: RantingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RantingPageRoutingModule {}
