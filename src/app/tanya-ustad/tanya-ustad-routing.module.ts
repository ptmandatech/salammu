import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TanyaUstadPage } from './tanya-ustad.page';

const routes: Routes = [
  {
    path: '',
    component: TanyaUstadPage
  },
  {
    path: 'chatting',
    loadChildren: () => import('./chatting/chatting.module').then( m => m.ChattingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TanyaUstadPageRoutingModule {}
