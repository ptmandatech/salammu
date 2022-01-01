import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProductPage } from './my-product.page';

const routes: Routes = [
  {
    path: '',
    component: MyProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProductPageRoutingModule {}
