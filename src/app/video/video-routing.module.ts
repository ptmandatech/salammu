import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoPage } from './video.page';

const routes: Routes = [
  {
    path: '',
    component: VideoPage
  },
  {
    path: 'detail-video/:id',
    loadChildren: () => import('./detail-video/detail-video.module').then( m => m.DetailVideoPageModule)
  },
  {
    path: 'tambah-video',
    loadChildren: () => import('./tambah-video/tambah-video.module').then( m => m.TambahVideoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPageRoutingModule {}
