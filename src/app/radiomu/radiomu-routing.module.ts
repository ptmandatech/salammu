import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RadiomuPage } from './radiomu.page';

const routes: Routes = [
  {
    path: '',
    component: RadiomuPage
  },
  {
    path: 'detail-radio',
    loadChildren: () => import('./detail-radio/detail-radio.module').then( m => m.DetailRadioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadiomuPageRoutingModule {}
