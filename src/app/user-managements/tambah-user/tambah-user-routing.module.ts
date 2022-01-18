import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahUserPage } from './tambah-user.page';

const routes: Routes = [
  {
    path: '',
    component: TambahUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahUserPageRoutingModule {}
