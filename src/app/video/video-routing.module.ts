import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoPage } from './video.page';

const routes: Routes = [
  {
    path: '',
    component: VideoPage
  },
  {
    path: 'detail-video',
    loadChildren: () => import('./detail-video/detail-video.module').then( m => m.DetailVideoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPageRoutingModule {}
