import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageUploaderPage } from './image-uploader.page';

const routes: Routes = [
  {
    path: '',
    component: ImageUploaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageUploaderPageRoutingModule {}
