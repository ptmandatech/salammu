import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UstadmuPage } from './ustadmu.page';

const routes: Routes = [
  {
    path: '',
    component: UstadmuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UstadmuPageRoutingModule {}
