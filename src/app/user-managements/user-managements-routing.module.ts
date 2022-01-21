import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementsPage } from './user-managements.page';

const routes: Routes = [
  {
    path: '',
    component: UserManagementsPage
  },
  {
    path: 'tambah-user/:id',
    loadChildren: () => import('./tambah-user/tambah-user.module').then( m => m.TambahUserPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementsPageRoutingModule {}
