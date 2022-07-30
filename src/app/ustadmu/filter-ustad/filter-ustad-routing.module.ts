import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterUstadPage } from './filter-ustad.page';

const routes: Routes = [
  {
    path: '',
    component: FilterUstadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterUstadPageRoutingModule {}
