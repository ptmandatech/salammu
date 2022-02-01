import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SemuaMenuPage } from './semua-menu.page';

const routes: Routes = [
  {
    path: '',
    component: SemuaMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SemuaMenuPageRoutingModule {}
